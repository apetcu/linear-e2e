'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
  description: string;
}

// Generate 100 dummy invoices
const generateDummyInvoices = (): Invoice[] => {
  const statuses: Invoice['status'][] = ['paid', 'pending', 'overdue'];
  const clients = ['Acme Corp', 'TechStart Inc', 'Global Solutions', 'Innovation Labs', 'Digital Ventures', 'NextGen Systems', 'Prime Industries', 'Future Tech'];
  const descriptions = [
    'Monthly consulting services',
    'Web development project',
    'Software license renewal',
    'Cloud infrastructure services',
    'Design and branding package',
    'API integration services',
    'Mobile app development',
    'Security audit and compliance'
  ];

  return Array.from({ length: 100 }, (_, i) => {
    const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 30);

    return {
      id: `INV-${String(i + 1).padStart(4, '0')}`,
      invoiceNumber: `INV-${String(i + 1).padStart(4, '0')}`,
      client: clients[Math.floor(Math.random() * clients.length)],
      amount: Math.floor(Math.random() * 50000) + 1000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: date.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      description: descriptions[Math.floor(Math.random() * descriptions.length)]
    };
  });
};

export default function InvoicesPage() {
  const [invoices] = useState<Invoice[]>(generateDummyInvoices());
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [displayedInvoices, setDisplayedInvoices] = useState<Invoice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 20;

  // Initialize with first page
  useEffect(() => {
    setDisplayedInvoices(invoices.slice(0, ITEMS_PER_PAGE));
  }, [invoices]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const container = tableContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      // Load more when scrolled to bottom
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        const nextPage = page + 1;
        const start = 0;
        const end = nextPage * ITEMS_PER_PAGE;

        if (end <= invoices.length) {
          setDisplayedInvoices(invoices.slice(start, end));
          setPage(nextPage);
        }
      }
    };

    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [page, invoices]);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      // In a real app, this would upload the file to a server
      console.log('Uploading file:', file.name);
      setIsModalOpen(false);
      setFile(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
              Invoices
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Manage your invoices and billing
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm"
          >
            Add Invoice
          </button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Table - Left Column */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div
              ref={tableContainerRef}
              className="overflow-auto"
              style={{ maxHeight: '600px' }}
            >
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {displayedInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      onClick={() => setSelectedInvoice(invoice)}
                      className={`
                        cursor-pointer transition-colors duration-150
                        hover:bg-zinc-50 dark:hover:bg-zinc-800/50
                        ${selectedInvoice?.id === invoice.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                      `}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                        {invoice.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-white font-medium">
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                        {invoice.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {displayedInvoices.length < invoices.length && (
                <div className="text-center py-4 text-sm text-zinc-500 dark:text-zinc-400">
                  Scroll for more invoices...
                </div>
              )}
            </div>
          </div>

          {/* Invoice Preview - Right Column */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
            {selectedInvoice ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                    {selectedInvoice.invoiceNumber}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Invoice Preview
                  </p>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                      Client
                    </p>
                    <p className="text-sm text-zinc-900 dark:text-white font-medium">
                      {selectedInvoice.client}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                      Amount
                    </p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                      ${selectedInvoice.amount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                      {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                      Issue Date
                    </p>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedInvoice.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                      Due Date
                    </p>
                    <p className="text-sm text-zinc-900 dark:text-white">
                      {selectedInvoice.dueDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                      Description
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedInvoice.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500 dark:text-zinc-400">
                <div className="text-center">
                  <p className="text-sm">Select an invoice to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Add Invoice
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFile(null);
                }}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Upload Invoice File
                </label>
                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    {file ? (
                      <div className="text-sm">
                        <p className="text-zinc-900 dark:text-white font-medium mb-1">
                          {file.name}
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">
                          PDF, DOC, or Image files
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setFile(null);
                  }}
                  className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
