// components/TransactionStatus.tsx
import React from 'react';

interface TransactionStatusProps {
  status: string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ status }) => {
  if (!status) return null;

  const getStatusColor = () => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    }
  };

  return (
    <div className={`p-4 rounded ${getStatusColor()}`}>
      Status: {status}
    </div>
  );
};

export default TransactionStatus;