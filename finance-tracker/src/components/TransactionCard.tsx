'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '../types';

const deleteTransaction = async (id: string) => {
  const response = await fetch(`https://symmetrical-space-barnacle-jp9px4x7qpw3jqq5-3001.app.github.dev/transactions/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete transaction');
};

const updateTransaction = async (updatedTransaction: Transaction) => {
  const response = await fetch(`https://symmetrical-space-barnacle-jp9px4x7qpw3jqq5-3001.app.github.dev/transactions/${updatedTransaction.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTransaction),
  });
  if (!response.ok) throw new Error('Failed to update transaction');
  return response.json();
};

export default function TransactionCard({ transaction }: { transaction: Transaction }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [type, setType] = useState<'income' | 'expense'>(transaction.type);
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(transaction.date);

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setIsEditing(false);
    },
  });

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(transaction.id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setCategory(transaction.category);
    setDate(transaction.date);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) {
      alert('Please fill in all fields.');
      return;
    }
    updateMutation.mutate({
      id: transaction.id,
      description,
      amount: parseFloat(amount),
      type,
      category,
      date,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            step="0.01"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300 disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-md transition duration-300"
            >
              Cancel
            </button>
          </div>
          {updateMutation.isError && (
            <p className="text-red-500 dark:text-red-400">
              Error: {(updateMutation.error as Error).message}
            </p>
          )}
        </form>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{transaction.description}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {transaction.category} | {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p
              className={`text-lg font-semibold ${
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'} ₹{transaction.amount}
            </p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}