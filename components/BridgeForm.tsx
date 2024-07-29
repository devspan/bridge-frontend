// BridgeForm.tsx
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaExchangeAlt, FaArrowRight } from 'react-icons/fa';

interface BridgeFormProps {
  sourceChain: string;
  setSourceChain: (value: string) => void;
  destinationChain: string;
  setDestinationChain: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  handleSubmit: () => Promise<void>;
  isLoading: boolean;
}

const BridgeForm: React.FC<BridgeFormProps> = ({
  sourceChain,
  setSourceChain,
  destinationChain,
  setDestinationChain,
  amount,
  setAmount,
  handleSubmit,
  isLoading,
}) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <FaExchangeAlt className="mr-2 text-blue-400" />
          Bridge Tokens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">Source Chain</label>
              <Select value={sourceChain} onValueChange={setSourceChain}>
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select source chain" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="rupaya" className="text-white">Rupaya</SelectItem>
                  <SelectItem value="bsc" className="text-white">Binance Smart Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FaArrowRight className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">Destination Chain</label>
              <Select value={destinationChain} onValueChange={setDestinationChain}>
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select destination chain" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="rupaya" className="text-white">Rupaya</SelectItem>
                  <SelectItem value="bsc" className="text-white">Binance Smart Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Amount</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-300 ease-in-out"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <FaExchangeAlt className="mr-2" />
                Bridge Tokens
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BridgeForm;