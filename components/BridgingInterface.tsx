import React, { useState, useEffect, useCallback } from 'react';
import WalletInfoSection from './WalletInfoSection';
import BridgeForm from './BridgeForm';
import TransactionHistory from './TransactionHistory';
import { 
  rupayaBridge, 
  binanceBridge,
  getUserBalance, 
  getContractWithSigner, 
  checkNetwork,
  parseEther,
  formatEther,
  RUPAYA_RPC_URL,
  BINANCE_TESTNET_RPC_URL
} from '../lib/ethers';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast";

interface BridgingInterfaceProps {
  connectedAddress: string;
}

const BridgingInterface: React.FC<BridgingInterfaceProps> = ({ connectedAddress }) => {
  const [sourceChain, setSourceChain] = useState('');
  const [destinationChain, setDestinationChain] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rupayaBalance, setRupayaBalance] = useState<bigint>(BigInt(0));
  const [bscBalance, setBscBalance] = useState<bigint>(BigInt(0));
  const [brupxBalance, setBrupxBalance] = useState<bigint>(BigInt(0));
  const [maxTransferAmount, setMaxTransferAmount] = useState<bigint>(BigInt(0));
  const [transferCooldown, setTransferCooldown] = useState<bigint>(BigInt(0));
  const { toast } = useToast();

  const refreshBalances = useCallback(async () => {
    try {
      const rupayaProvider = new ethers.JsonRpcProvider(RUPAYA_RPC_URL);
      const bscProvider = new ethers.JsonRpcProvider(BINANCE_TESTNET_RPC_URL);
      
      const rupayaBalance = await rupayaProvider.getBalance(connectedAddress);
      const bscBalance = await bscProvider.getBalance(connectedAddress);
      const brupxBalance = await getUserBalance(connectedAddress);

      setRupayaBalance(rupayaBalance);
      setBscBalance(bscBalance);
      setBrupxBalance(brupxBalance);
    } catch (error) {
      console.error('Error refreshing balances:', error);
      toast({
        title: "Failed to refresh balances",
        description: "An error occurred while fetching your balances. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [connectedAddress, toast]);

  const fetchNetworkInfo = useCallback(async () => {
    let retries = 3;
    while (retries > 0) {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
  
          let bridgeContract;
          if (Number(network.chainId) === 97) { // Binance Testnet
            bridgeContract = await getContractWithSigner(binanceBridge);
          } else if (Number(network.chainId) === 799) { // Rupaya Testnet
            bridgeContract = await getContractWithSigner(rupayaBridge);
          } else {
            throw new Error('Unsupported network');
          }
  
          const maxAmount = await bridgeContract.maxTransferAmount();
          const cooldown = await bridgeContract.transferCooldown();
  
          setMaxTransferAmount(maxAmount);
          setTransferCooldown(cooldown);
          return; // Success, exit the function
        } else {
          throw new Error('No Ethereum provider found');
        }
      } catch (error) {
        console.error('Error fetching network info:', error);
        retries--;
        if (retries === 0) {
          let errorMessage = "An error occurred while fetching network information.";
          if (error instanceof Error) {
            errorMessage += ` Details: ${error.message}`;
          }
          toast({
            title: "Failed to fetch network info",
            description: errorMessage,
            variant: "destructive",
            duration: 5000,
          });
          setMaxTransferAmount(BigInt(0));
          setTransferCooldown(BigInt(0));
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
        }
      }
    }
  }, [toast]);

  useEffect(() => {
    const fetchData = async () => {
      await refreshBalances();
      await fetchNetworkInfo();
    };
    fetchData();
  }, [connectedAddress, refreshBalances, fetchNetworkInfo]);

  const storeTransaction = (transaction: any) => {
    try {
      const storedTransactions = JSON.parse(localStorage.getItem(`transactions_${connectedAddress}`) || '[]');
      storedTransactions.push(transaction);
      localStorage.setItem(`transactions_${connectedAddress}`, JSON.stringify(storedTransactions));
    } catch (error) {
      console.error('Error storing transaction:', error);
      toast({
        title: "Error storing transaction",
        description: "An error occurred while storing the transaction. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (sourceChain === 'rupaya' && destinationChain === 'bsc') {
        await checkNetwork(799); // Rupaya testnet chain ID
        const rupayaBridgeWithSigner = await getContractWithSigner(rupayaBridge);
        const tx = await rupayaBridgeWithSigner.deposit({ value: parseEther(amount) });
        await tx.wait();

        const newTransaction = {
          date: new Date().toISOString(),
          from: 'Rupaya',
          to: 'BSC',
          amount,
          status: 'Completed',
          txHash: tx.hash,
        };
        storeTransaction(newTransaction);

        toast({
          title: "Deposit successful",
          description: "Tokens have been deposited to the Rupaya bridge.",
          variant: "default",
        });
      } else if (sourceChain === 'bsc' && destinationChain === 'rupaya') {
        await checkNetwork(97); // BSC testnet chain ID
        const binanceBridgeWithSigner = await getContractWithSigner(binanceBridge);
        const tx = await binanceBridgeWithSigner.burn(parseEther(amount));
        await tx.wait();

        const newTransaction = {
          date: new Date().toISOString(),
          from: 'BSC',
          to: 'Rupaya',
          amount,
          status: 'Completed',
          txHash: tx.hash,
        };
        storeTransaction(newTransaction);

        toast({
          title: "Burn successful",
          description: "Tokens have been burned on the Binance bridge.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "An error occurred while processing the transaction.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      refreshBalances();
    }
  };

  const getExplorerUrl = (txHash: string, chain: string) => {
    if (chain === 'rupaya') {
      return `${process.env.NEXT_PUBLIC_RUPAYA_EXPLORER_URL}/tx/${txHash}`;
    } else if (chain === 'bsc') {
      return `${process.env.NEXT_PUBLIC_BSC_EXPLORER_URL}/tx/${txHash}`;
    }
    return '#';
  };

  return (
    <div className="space-y-6">
      <WalletInfoSection
        address={connectedAddress}
        rupayaBalance={rupayaBalance}
        bscBalance={bscBalance}
        brupxBalance={brupxBalance}
        maxTransferAmount={maxTransferAmount}
        transferCooldown={transferCooldown}
        refreshBalances={refreshBalances}
        fetchNetworkInfo={fetchNetworkInfo}
      />
      <BridgeForm
        sourceChain={sourceChain}
        setSourceChain={setSourceChain}
        destinationChain={destinationChain}
        setDestinationChain={setDestinationChain}
        amount={amount}
        setAmount={setAmount}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <TransactionHistory
        accountAddress={connectedAddress}
        getExplorerUrl={getExplorerUrl}
      />
    </div>
  );
};

export default BridgingInterface;