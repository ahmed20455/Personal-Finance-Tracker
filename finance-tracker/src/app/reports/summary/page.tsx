'use client';

import { useTheme } from '../../../context/ThemeContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useTransactions } from '../../../hooks/useTransactions';
import BudgetPlanner from '@/components/BudgetPlanner';

export default function Summary() {
  const { theme } = useTheme();
  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const totalIncome = transactions?.reduce((sum, t) => (t.type === 'income' ? sum + t.amount : sum), 0) || 0;
  const totalExpenses = transactions?.reduce((sum, t) => (t.type === 'expense' ? sum + t.amount : sum), 0) || 0;
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transactions={transactions || []} searchQuery="" setSearchQuery={() => {}} />
      <div className="p-6 max-w-7xl mx-auto flex-grow w-full">
        <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Reports - Summary</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div><p className="text-gray-600 dark:text-gray-400">Total Income</p><p className="text-green-600 dark:text-green-400 font-bold text-lg">₹{totalIncome}</p></div>
            <div><p className="text-gray-600 dark:text-gray-400">Total Expenses</p><p className="text-red-600 dark:text-red-400 font-bold text-lg">₹{totalExpenses}</p></div>
            <div><p className="text-gray-600 dark:text-gray-400">Net Balance</p><p className={`${netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-bold text-lg`}>₹{netBalance}</p></div>
          </div>
        </div>
        <BudgetPlanner/>
        
      </div>
      <Footer />
    </div>
  );
}