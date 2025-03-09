'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '../types';

const deleteTransaction = async (id: string) => {
  const response = await fetch(`https://symmetrical-space-barnacle-jp9px4x7qpw3jqq5-3001.app.github.dev/transactions/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete transaction');
};

export default function TransactionCard({ transaction }: { transaction: Transaction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      mutation.mutate(transaction.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{transaction.description}</h3>
        <p className="text-gray-600 dark:text-gray-400">{transaction.category} | {new Date(transaction.date).toLocaleDateString()}</p>
      </div>
      <div className="text-right">
        <p className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
          {transaction.type === 'income' ? '+' : '-'} ₹{transaction.amount}
        </p>
        <button onClick={handleDelete} disabled={mutation.isPending} className="mt-2 text-red-500 hover:text-red-700 font-medium">
          {mutation.isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}