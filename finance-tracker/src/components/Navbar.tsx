'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTransactions } from '../hooks/useTransactions';
import Papa from 'papaparse';

export default function Navbar({
  transactions,
  searchQuery,
  setSearchQuery,
}: {
  transactions: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { data: fetchedTransactions, isLoading, error } = useTransactions();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleExportToCSV = () => {
    if (!fetchedTransactions || fetchedTransactions.length === 0) {
      alert('No transactions to export.');
      return;
    }
    const csv = Papa.unparse(fetchedTransactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Finance Tracker
        </Link>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link href="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hover:text-blue-400 transition-colors"
            >
              Reports
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                <Link
                  href="/reports/summary"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-white hover:bg-gray-600 rounded-md"
                >
                  Summary
                </Link>
                <Link
                  href="/reports/charts"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-white hover:bg-gray-600 rounded-md"
                >
                  Charts
                </Link>
              </div>
            )}
          </div>
          <Link href="/transactions" className="hover:text-blue-400 transition-colors">
            Transactions
          </Link>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="ocean">Ocean</option>
          </select>

          <button
            onClick={handleExportToCSV}
            className="p-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
          >
            CSV
          </button>
          <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
            Account
          </button>
        </div>
      </div>
    </nav>
  );
}