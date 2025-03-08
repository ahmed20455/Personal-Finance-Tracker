'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { Transaction } from '../types';
import Papa from 'papaparse';

interface NavbarProps {
  transactions: Transaction[];
}

const Navbar = ({ transactions }: NavbarProps) => {
  const router = useRouter();
  const { currency, symbol, setCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const reportsRef = useRef<HTMLDivElement>(null);

  const exportToCSV = () => {
    const formattedTransactions = transactions.map((transaction) => {
      const date = new Date(transaction.date);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      return { ...transaction, date: formattedDate };
    });
    const csv = Papa.unparse(formattedTransactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reportsRef.current && !reportsRef.current.contains(event.target as Node)) {
        setIsReportsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" onClick={(e) => { e.preventDefault(); router.push('/'); }} className="text-2xl font-bold">
              Finance Tracker
            </a>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-4 hidden sm:block">
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Navigation and Controls */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:space-x-6">
              <a href="/" onClick={(e) => { e.preventDefault(); router.push('/'); }} className="hover:text-gray-200">
                Home
              </a>
              <div className="relative" ref={reportsRef}>
                <button
                  onClick={() => setIsReportsOpen(!isReportsOpen)}
                  className="hover:text-gray-200 focus:outline-none"
                >
                  Reports
                </button>
                {isReportsOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-10">
                    <a href="/reports/charts" onClick={(e) => { e.preventDefault(); router.push('/reports/charts'); setIsReportsOpen(false); }} className="block px-4 py-2 text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Charts
                    </a>
                    <a href="/reports/summary" onClick={(e) => { e.preventDefault(); router.push('/reports/summary'); setIsReportsOpen(false); }} className="block px-4 py-2 text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Summary
                    </a>
                  </div>
                )}
              </div>
              <a href="/transactions" onClick={(e) => { e.preventDefault(); router.push('/transactions'); }} className="hover:text-gray-200">
                Transactions
              </a>
            </div>

            {/* Controls */}
            <div className="hidden sm:flex items-center space-x-2">
              <div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'INR' | 'USD' | 'EUR')}
                  className="p-1 rounded-md bg-transparent border border-white text-white focus:outline-none"
                >
                  <option value="INR">₹</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </select>
              </div>
              <button onClick={toggleTheme} className="p-1 rounded-md hover:bg-gray-700 focus:outline-none">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <button onClick={exportToCSV} className="p-1 rounded-md bg-green-600 hover:bg-green-700 focus:outline-none">
                CSV
              </button>
              <div className="relative">
                <button className="hover:text-gray-200 focus:outline-none">Account</button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 hidden">
                  <a href="/login" onClick={(e) => { e.preventDefault(); router.push('/login'); }} className="block px-4 py-2 text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Login
                  </a>
                  <a href="/signup" onClick={(e) => { e.preventDefault(); router.push('/signup'); }} className="block px-4 py-2 text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Signup
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg
                  className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <svg
                  className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
          <a href="/" onClick={(e) => { e.preventDefault(); router.push('/'); setIsOpen(false); }} className="block px-3 py-2 rounded-md text-white hover:bg-gray-700">
            Home
          </a>
          <div className="relative">
            <button
              onClick={() => setIsReportsOpen(!isReportsOpen)}
              className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-gray-700 focus:outline-none"
            >
              Reports
            </button>
            {isReportsOpen && (
              <div className="mt-1 space-y-1">
                <a href="/reports/charts" onClick={(e) => { e.preventDefault(); router.push('/reports/charts'); setIsOpen(false); setIsReportsOpen(false); }} className="block px-6 py-2 text-gray-200 hover:bg-gray-700">
                  Charts
                </a>
                <a href="/reports/summary" onClick={(e) => { e.preventDefault(); router.push('/reports/summary'); setIsOpen(false); setIsReportsOpen(false); }} className="block px-6 py-2 text-gray-200 hover:bg-gray-700">
                  Summary
                </a>
              </div>
            )}
          </div>
          <a href="/transactions" onClick={(e) => { e.preventDefault(); router.push('/transactions'); setIsOpen(false); }} className="block px-3 py-2 rounded-md text-white hover:bg-gray-700">
            Transactions
          </a>
          <div className="px-3 py-2 space-y-2">
            <div>
              <label className="mr-2 text-sm font-medium">Currency:</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'INR' | 'USD' | 'EUR')}
                className="p-1 rounded-md bg-transparent border border-white text-white focus:outline-none"
              >
                <option value="INR">₹</option>
                <option value="USD">$</option>
                <option value="EUR">€</option>
              </select>
            </div>
            <button onClick={toggleTheme} className="w-full p-2 rounded-md hover:bg-gray-700 focus:outline-none">
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
            <button onClick={exportToCSV} className="w-full p-2 rounded-md bg-green-600 hover:bg-green-700 focus:outline-none">
              Export to CSV
            </button>
            <div>
              <button className="w-full text-left p-2 rounded-md hover:bg-gray-700 focus:outline-none">
                Account
              </button>
              <div className="mt-1 space-y-1">
                <a href="/login" onClick={(e) => { e.preventDefault(); router.push('/login'); setIsOpen(false); }} className="block px-6 py-2 text-gray-200 hover:bg-gray-700">
                  Login
                </a>
                <a href="/signup" onClick={(e) => { e.preventDefault(); router.push('/signup'); setIsOpen(false); }} className="block px-6 py-2 text-gray-200 hover:bg-gray-700">
                  Signup
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;