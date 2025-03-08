'use client';

import { useState } from 'react';
import TransactionCard from '../components/TransactionCard';
import TransactionForm from '../components/TransactionForm';
import { useTransactions } from '../hooks/useTransactions'; // Correct import
import { useQueryClient } from '@tanstack/react-query'; // Separate import
import { Transaction } from '../types';

export default function Home() {
  const queryClient = useQueryClient();
  const { data: transactions, error, isLoading } = useTransactions();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  if (isLoading) return (
    <div className="p-6 bg-gray-200">
      <div className="animate-pulse space-y-4">
        <div className="h-16 bg-gray-300 rounded-lg"></div>
        <div className="h-16 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
  if (error) return (
    <div className="p-6 bg-red-100 text-red-500">
      Error: {error.message}
      <button
        onClick={() => queryClient.invalidateQueries({ queryKey: ['transactions'] })}
        className="ml-4 text-blue-600 underline"
      >
        Retry
      </button>
    </div>
  );

  // Calculate summary
  const totalIncome = transactions?.reduce(
    (sum, t) => (t.type === 'income' ? sum + t.amount : sum),
    0
  ) || 0;
  const totalExpenses = transactions?.reduce(
    (sum, t) => (t.type === 'expense' ? sum + t.amount : sum),
    0
  ) || 0;
  const netBalance = totalIncome - totalExpenses;

  // Filter and sort transactions
  const filteredTransactions = transactions?.filter((transaction) =>
    filterType === 'all' ? true : transaction.type === filterType
  );
  const sortedTransactions = [...(filteredTransactions || [])].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.amount - a.amount;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Personal Finance Tracker</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600">Total Income</p>
            <p className="text-green-600 font-bold">₹{totalIncome}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Expenses</p>
            <p className="text-red-600 font-bold">₹{totalExpenses}</p>
          </div>
          <div>
            <p className="text-gray-600">Net Balance</p>
            <p className={`${netBalance >= 0 ? 'text-green-600' : 'text-red-600'} font-bold`}>
              ₹{netBalance}
            </p>
          </div>
        </div>
      </div>
      <TransactionForm />
      <div className="mb-6 flex space-x-4">
        <div>
          <label className="mr-2 font-medium">Filter by Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
            className="p-2 border rounded-md"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="mr-2 font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            className="p-2 border rounded-md"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>
      </div>
      <div className="mt-6">
        {sortedTransactions?.map((transaction: Transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}