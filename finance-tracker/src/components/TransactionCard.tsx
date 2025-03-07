import { Transaction } from '../types';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{transaction.description}</h3>
          <p className="text-gray-500">{transaction.category}</p>
          <p className="text-sm text-gray-400">
            {new Date(transaction.date).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p
            className={`text-lg font-bold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {transaction.type === 'income' ? '+' : '-'} ${Math.abs(transaction.amount)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;