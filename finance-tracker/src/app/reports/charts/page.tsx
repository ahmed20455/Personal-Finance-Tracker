'use client';

import { useTheme } from '../../../context/ThemeContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useTransactions } from '../../../hooks/useTransactions';
import FinanceChart from '../../../components/FinanceChart';

export default function Charts() {
  const { theme } = useTheme();
  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transactions={transactions || []} searchQuery="" setSearchQuery={() => {}} />
      <div className="p-6 max-w-7xl mx-auto flex-grow w-full">
        <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Reports - Charts</h1>
        <FinanceChart transactions={transactions || []} />
      </div>
      <Footer />
    </div>
  );
}