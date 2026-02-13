import os
import re
import sys
import uuid

import requests

JIRA_BASE_URL = os.environ["JIRA_BASE_URL"]
JIRA_AUTH = (os.environ["JIRA_USER_EMAIL"], os.environ["JIRA_API_TOKEN"])


def extract_ticket(command: str) -> str | None:
    match = re.search(r"SNDY-\d+", command)
    return match.group(0) if match else None


def fetch_ticket(ticket: str) -> dict | None:
    resp = requests.get(
        f"{JIRA_BASE_URL}/rest/api/3/issue/{ticket}",
        auth=JIRA_AUTH,
        params={"fields": "summary,status,description,attachment"},
    )
    if resp.ok:
        return resp.json()
    print(f"Failed to fetch {ticket}: {resp.status_code} {resp.text}")
    return None


def download_attachments(issue: dict, dest: str) -> list[str]:
    os.makedirs(dest, exist_ok=True)
    paths = []
    for att in issue["fields"].get("attachment") or []:
        resp = requests.get(att["content"], auth=JIRA_AUTH)
        if resp.ok:
            path = os.path.join(dest, att["filename"])
            with open(path, "wb") as f:
                f.write(resp.content)
            paths.append(path)
            print(f"  Downloaded: {att['filename']}")
    return paths


def flatten_adf(node) -> str:
    """Flatten Atlassian Document Format to plain text."""
    if not node:
        return ""
    if isinstance(node, dict):
        if "text" in node:
            return node["text"]
        return "\n".join(flatten_adf(c) for c in node.get("content", []))
    if isinstance(node, list):
        return "\n".join(flatten_adf(item) for item in node)
    return ""


def set_output(key: str, value: str):
    with open(os.environ["GITHUB_OUTPUT"], "a") as f:
        if "\n" in value:
            delimiter = uuid.uuid4().hex
            f.write(f"{key}<<{delimiter}\n{value}\n{delimiter}\n")
        else:
            f.write(f"{key}={value}\n")


def add_comment(ticket: str, message: str, link_url: str | None = None):
    content = [
        {
            "type": "paragraph",
            "content": [{"type": "text", "text": message}],
        }
    ]
    if link_url:
        content.append(
            {
                "type": "paragraph",
                "content": [
                    {
                        "type": "text",
                        "text": "Pull Request: ",
                    },
                    {
                        "type": "text",
                        "text": link_url,
                        "marks": [{"type": "link", "attrs": {"href": link_url}}],
                    },
                ],
            }
        )
    requests.post(
        f"{JIRA_BASE_URL}/rest/api/3/issue/{ticket}/comment",
        auth=JIRA_AUTH,
        json={
            "body": {
                "version": 1,
                "type": "doc",
                "content": content,
            }
        },
    ).raise_for_status()


def transition_issue(ticket: str, target_status: str):
    """Transition a Jira issue to the given status name (e.g. 'In Review')."""
    resp = requests.get(
        f"{JIRA_BASE_URL}/rest/api/3/issue/{ticket}/transitions",
        auth=JIRA_AUTH,
    )
    resp.raise_for_status()

    transitions = resp.json().get("transitions", [])
    transition_id = None
    for t in transitions:
        if t["to"]["name"].lower() == target_status.lower():
            transition_id = t["id"]
            break

    if not transition_id:
        available = [f"{t['to']['name']} (id={t['id']})" for t in transitions]
        print(f"No transition to '{target_status}' found. Available: {available}")
        sys.exit(1)

    resp = requests.post(
        f"{JIRA_BASE_URL}/rest/api/3/issue/{ticket}/transitions",
        auth=JIRA_AUTH,
        json={"transition": {"id": transition_id}},
    )
    resp.raise_for_status()
    print(f"Transitioned {ticket} to '{target_status}'")


def cmd_fetch():
    command = os.environ.get("COMMAND", "")

    ticket = extract_ticket(command)
    if not ticket:
        print(f"No SNDY- ticket found in: {command}")
        set_output("found", "false")
        return

    issue = fetch_ticket(ticket)
    if not issue:
        set_output("found", "false")
        sys.exit(1)

    summary = issue["fields"]["summary"]
    status = issue["fields"]["status"]["name"]
    description = flatten_adf(issue["fields"].get("description"))
    attachments = download_attachments(issue, "attachments")

    print(f"{ticket}: {summary} [{status}]")

    set_output("found", "true")
    set_output("ticket", ticket)
    set_output("summary", summary)
    set_output("status", status)
    set_output("description", description)
    set_output("has_attachments", "true" if attachments else "false")


def cmd_comment():
    ticket = sys.argv[2]
    message = sys.argv[3]
    link_url = sys.argv[4] if len(sys.argv) > 4 else None
    add_comment(ticket, message, link_url)
    print(f"Comment added to {ticket}")


def cmd_transition():
    ticket = sys.argv[2]
    target_status = sys.argv[3] if len(sys.argv) > 3 else "In Review"
    transition_issue(ticket, target_status)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "fetch"
    {"fetch": cmd_fetch, "comment": cmd_comment, "transition": cmd_transition}[cmd]()
