'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrency } from '../context/CurrencyContext';
import { Transaction } from '../types';

const addTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
  const response = await fetch('https://symmetrical-space-barnacle-jp9px4x7qpw3jqq5-3001.app.github.dev/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTransaction),
  });
  if (!response.ok) throw new Error('Failed to add transaction');
  return response.json();
};

export default function TransactionForm() {
  const queryClient = useQueryClient();
  const { symbol } = useCurrency();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const mutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setDescription('');
      setAmount('');
      setType('income');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) {
      alert('Please fill in all fields.');
      return;
    }
    mutation.mutate({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" step="0.01" />
        <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
        <button type="submit" disabled={mutation.isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300 disabled:opacity-50">
          {mutation.isPending ? 'Adding...' : 'Add Transaction'}
        </button>
        {mutation.isError && <p className="text-red-500 dark:text-red-400">Error: {(mutation.error as Error).message}</p>}
      </form>
    </div>
  );
}