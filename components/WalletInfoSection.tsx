import React from 'react';
import { FaWallet, FaCoins, FaNetworkWired, FaCopy, FaSync } from 'react-icons/fa';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatEther } from '@ethersproject/units';

interface WalletInfoSectionProps {
  address: string;
  rupayaBalance: bigint;
  bscBalance: bigint;
  brupxBalance: bigint;
  maxTransferAmount: bigint;
  transferCooldown: bigint;
  refreshBalances: () => Promise<void>;
  fetchNetworkInfo: () => Promise<void>;
}

const WalletInfoSection: React.FC<WalletInfoSectionProps> = ({
  address,
  rupayaBalance,
  bscBalance,
  brupxBalance,
  maxTransferAmount,
  transferCooldown,
  refreshBalances,
  fetchNetworkInfo,
}) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <FaWallet className="text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Wallet Info</h3>
            </div>
            <Button 
              variant="ghost"
              size="sm"
              onClick={refreshBalances}
              className="text-blue-400 hover:text-blue-300"
            >
              <FaSync className="mr-1" />
              Refresh
            </Button>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-700 p-2 rounded flex justify-between items-center">
              <p className="text-sm text-gray-300 break-all">{address}</p>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(address)}
                className="text-blue-400 hover:text-blue-300 ml-2"
              >
                <FaCopy />
              </Button>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <p className="text-sm text-gray-300">RUPX Balance on Rupaya Chain</p>
              <p className="text-lg font-bold text-white">{formatEther(rupayaBalance)} RUPX</p>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <p className="text-sm text-gray-300">BNB Balance on Binance Chain</p>
              <p className="text-lg font-bold text-white">{formatEther(bscBalance)} BNB</p>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <p className="text-sm text-gray-300">BRUPX Balance on Binance Chain</p>
              <p className="text-lg font-bold text-white">{formatEther(brupxBalance)} BRUPX</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <FaNetworkWired className="text-green-400" />
              <h3 className="text-lg font-semibold text-white">Network Info</h3>
            </div>
            <Button 
              variant="ghost"
              size="sm"
              onClick={fetchNetworkInfo}
              className="text-blue-400 hover:text-blue-300"
            >
              <FaSync className="mr-1" />
              Refresh
            </Button>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-700 p-2 rounded">
              <p className="text-sm text-gray-300">Max Transfer</p>
              <p className="text-lg font-bold text-white">{formatEther(maxTransferAmount)} RUPX</p>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <p className="text-sm text-gray-300">Cooldown</p>
              <p className="text-lg font-bold text-white">{transferCooldown.toString()} seconds</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletInfoSection;