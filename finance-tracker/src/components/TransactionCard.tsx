import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '../types';

const deleteTransaction = async (id: number) => {
  const response = await fetch(`https://symmetrical-space-barnacle-jp9px4x7qpw3jqq5-3001.app.github.dev/transactions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete transaction');
};

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition mb-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{transaction.description}</h3>
        <p className="text-gray-500">{transaction.category}</p>
        <p className="text-sm text-gray-400">
          {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <p
          className={`text-lg font-bold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {transaction.type === 'income' ? '+' : '-'} ₹{Math.abs(transaction.amount)}
        </p>
        <button
          onClick={() => mutation.mutate(transaction.id)}
          className="text-red-500 hover:text-red-700"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default TransactionCard;