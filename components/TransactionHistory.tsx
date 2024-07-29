import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaTrash, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import { useToast } from "@/components/ui/use-toast";

interface BridgeTransaction {
  date: string;
  from: string;
  to: string;
  amount: string;
  status: string;
  txHash: string;
}

interface TransactionHistoryProps {
  accountAddress: string;
  getExplorerUrl: (txHash: string, chain: string) => string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  accountAddress,
  getExplorerUrl,
}) => {
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedTransactions = localStorage.getItem(`transactions_${accountAddress}`);
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, [accountAddress]);

  const clearHistory = () => {
    localStorage.removeItem(`transactions_${accountAddress}`);
    setTransactions([]);
    toast({
      title: "Transaction history cleared",
      description: "Your transaction history has been cleared.",
      variant: "default",
    });
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `rupaya_bridge_transactions_${accountAddress.slice(0, 6)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    linkElement.remove();

    toast({
      title: "Transaction history exported",
      description: "Your transaction history has been downloaded as a JSON file.",
      variant: "default",
    });
  };

  return (
    <Card className="bg-gray-800 border-gray-700 mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white flex items-center justify-between">
          <span>Transaction History</span>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={exportHistory} className="text-blue-400 hover:text-blue-300 border-blue-400 hover:border-blue-300">
              <FaDownload className="mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearHistory} className="text-red-400 hover:text-red-300 border-red-400 hover:border-red-300">
              <FaTrash className="mr-2" />
              Clear
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption className="text-gray-400">A list of your recent transactions</TableCaption>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">From</TableHead>
                <TableHead className="text-gray-300">To</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Transaction Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow key={index} className="border-gray-700">
                  <TableCell className="text-gray-300">{new Date(tx.date).toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{tx.from}</TableCell>
                  <TableCell className="text-gray-300">{tx.to}</TableCell>
                  <TableCell className="text-gray-300">{tx.amount} RUPX</TableCell>
                  <TableCell className="text-gray-300">{tx.status}</TableCell>
                  <TableCell className="text-gray-300">
                    <a 
                      href={getExplorerUrl(tx.txHash, tx.from)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline flex items-center"
                    >
                      {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                      <FaExternalLinkAlt className="ml-1 text-xs" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;