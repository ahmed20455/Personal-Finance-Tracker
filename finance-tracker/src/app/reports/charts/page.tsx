'use client';

import { useTheme } from '../../../context/ThemeContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Transaction } from '../../../types';

export default function Charts() {
  const { theme } = useTheme();
  const transactions: Transaction[] = []; // Placeholder

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transactions={transactions} searchQuery="" setSearchQuery={() => {}} />
      <div className="p-6 max-w-7xl mx-auto flex-grow w-full">
        <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          Reports - Charts
        </h1>
        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
          This page will display detailed financial charts. Coming soon!
        </p>
      </div>
      <Footer />
    </div>
  );
}