'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TransactionCard from '../components/TransactionCard';
import TransactionForm from '../components/TransactionForm';
import FinanceChart from '../components/FinanceChart';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../hooks/useTransactions';
import { useQueryClient } from '@tanstack/react-query';
import { Transaction } from '../types';
import Papa from 'papaparse';

type Currency = 'INR' | 'USD' | 'EUR';

export default function Home() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency, symbol, setCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();

  const initialFilterType = (searchParams.get('filter') as 'all' | 'income' | 'expense') || 'all';
  const initialSortBy = (searchParams.get('sort') as 'date' | 'amount') || 'date';

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>(initialFilterType);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>(initialSortBy);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: transactions, error, isLoading } = useTransactions();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', filterType);
    params.set('sort', sortBy);
    router.push(`/?${params.toString()}`, { scroll: false });
  }, [filterType, sortBy, router, searchParams]);

  if (isLoading) return (
    <div className="p-6 bg-gray-200 dark:bg-gray-700">
      <div className="animate-pulse space-y-4">
        <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
      </div>
    </div>
  );
  if (error) return (
    <div className="p-6 bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-300">
      Error: {error.message}
      <button
        onClick={() => queryClient.invalidateQueries({ queryKey: ['transactions'] })}
        className="ml-4 text-blue-600 dark:text-blue-400 underline"
      >
        Retry
      </button>
    </div>
  );

  const totalIncome = transactions?.reduce(
    (sum, t) => (t.type === 'income' ? sum + t.amount : sum),
    0
  ) || 0;
  const totalExpenses = transactions?.reduce(
    (sum, t) => (t.type === 'expense' ? sum + t.amount : sum),
    0
  ) || 0;
  const netBalance = totalIncome - totalExpenses;

  const filteredTransactions = transactions
    ?.filter((transaction) =>
      filterType === 'all' ? true : transaction.type === filterType
    )
    .filter((transaction) =>
      searchQuery
        ? transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  const sortedTransactions = [...(filteredTransactions || [])].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.amount - a.amount;
  });

  const exportToCSV = () => {
    const csv = Papa.unparse(transactions || []);
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
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row sm:space-y-0 space-y-4">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Personal Finance Tracker</h1>
        <div className="flex space-x-4 flex-col sm:flex-row sm:space-y-0 space-y-4">
          <div>
            <label className="mr-2 font-medium text-gray-600 dark:text-gray-300">Currency:</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          <button
            onClick={exportToCSV}
            className="p-2 border rounded-md bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
          >
            Export to CSV
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Total Income</p>
            <p className="text-green-600 dark:text-green-400 font-bold">{symbol}{totalIncome}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Total Expenses</p>
            <p className="text-red-600 dark:text-red-400 font-bold">{symbol}{totalExpenses}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Net Balance</p>
            <p className={`${netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-bold`}>
              {symbol}{netBalance}
            </p>
          </div>
        </div>
      </div>
      <FinanceChart transactions={transactions || []} />
      <CategoryBreakdown transactions={transactions || []} />
      <TransactionForm />
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by description or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 w-full border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
        />
      </div>
      <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div>
          <label className="mr-2 font-medium text-gray-600 dark:text-gray-300">Filter by Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="mr-2 font-medium text-gray-600 dark:text-gray-300">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>
      </div>
      <div className="mt-6">
        {sortedTransactions?.length ? (
          sortedTransactions.map((transaction: Transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">No transactions found.</p>
        )}
      </div>
    </div>
  );
}