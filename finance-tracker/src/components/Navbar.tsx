'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close mobile menu when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      setIsDropdownOpen(false); // Close dropdown when menu closes
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <Link href="/" className="text-2xl font-bold">
          Finance Tracker
        </Link>
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {/* Desktop and Mobile Menu */}
          <div
            ref={menuRef}
            className={`${
              isMobileMenuOpen ? 'block' : 'hidden'
            } md:flex md:items-center md:space-x-6 absolute md:static top-16 right-4 md:right-auto bg-gray-800 md:bg-transparent p-4 md:p-0 rounded-md shadow-lg md:shadow-none w-64 md:w-auto ${
              isMobileMenuOpen ? 'z-50' : ''
            }`}
          >
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 md:mb-0 md:w-64 w-full"
            />
            <Link
              href="/"
              onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
              className="block md:inline-block hover:text-blue-400 transition-colors py-3 md:py-0 text-lg md:text-base"
            >
              Home
            </Link>
            <div className="relative">
              <button
                onClick={() => {
                  if (isMobileMenuOpen) {
                    setIsMobileMenuOpen(false); // Close mobile menu
                  } else {
                    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown on desktop
                  }
                }}
                className="block md:inline-block hover:text-blue-400 transition-colors py-3 md:py-0 text-lg md:text-base"
              >
                Reports
              </button>
              {(isMobileMenuOpen || (isDropdownOpen && !isMobileMenuOpen)) && (
                <div className="md:absolute md:right-0 md:mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                  <Link
                    href="/reports/summary"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-white hover:bg-gray-600 rounded-md text-base"
                  >
                    Summary
                  </Link>
                  <Link
                    href="/reports/charts"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-white hover:bg-gray-600 rounded-md text-base"
                  >
                    Charts
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/transactions"
              onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
              className="block md:inline-block hover:text-blue-400 transition-colors py-3 md:py-0 text-lg md:text-base"
            >
              Transactions
            </Link>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 py-3 md:py-0 text-lg md:text-base w-full md:w-auto"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 py-3 md:py-0 text-lg md:text-base w-full md:w-auto"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="ocean">Ocean</option>
            </select>
            
            <button
              onClick={handleExportToCSV}
              className="p-3 bg-green-600 hover:bg-green-700 rounded-md transition-colors py-3 md:py-0 text-lg md:text-base w-full md:w-auto"
            >
              CSV
            </button>
            <button className="p-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors py-3 md:py-0 text-lg md:text-base w-full md:w-auto">
              Account
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}