// app/contexts/WalletContext.tsx
"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast";

interface WalletContextType {
  address: string | null;
  rupayaBalance: string;
  bscBalance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

type ExtendedEip1193Provider = ethers.Eip1193Provider & {
  on(event: string, listener: (...args: any[]) => void): void;
  removeListener(event: string, listener: (...args: any[]) => void): void;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [rupayaBalance, setRupayaBalance] = useState<string>('0');
  const [bscBalance, setBscBalance] = useState<string>('0');
  const { toast } = useToast();

  const refreshBalances = useCallback(async () => {
    if (!address) return;

    try {
      // Fetch Rupaya balance
      const rupayaProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RUPAYA_RPC_URL);
      const rupayaBalanceWei = await rupayaProvider.getBalance(address);
      setRupayaBalance(ethers.formatEther(rupayaBalanceWei));

      // Fetch BSC balance
      const bscProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BSC_RPC_URL);
      const bscBalanceWei = await bscProvider.getBalance(address);
      setBscBalance(ethers.formatEther(bscBalanceWei));
    } catch (error) {
      console.error('Failed to fetch balances:', error);
      toast({
        title: "Failed to fetch balances",
        description: "An error occurred while fetching your wallet balances",
        variant: "destructive"
      });
    }
  }, [address, toast]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await (window.ethereum as ExtendedEip1193Provider).request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const newAddress = await signer.getAddress();
        setAddress(newAddress);
        await refreshBalances();
        toast({
          title: "Wallet connected",
          description: `Connected to ${newAddress}`,
          variant: "default"
        });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        toast({
          title: "Failed to connect wallet",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Metamask not detected",
        description: "Please install Metamask to use this application",
        variant: "destructive"
      });
    }
  };

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setRupayaBalance('0');
    setBscBalance('0');
    toast({ title: "Wallet disconnected", variant: "default" });
  }, [toast]);

  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== address) {
        setAddress(accounts[0]);
        await refreshBalances();
        toast({
          title: "Account changed",
          description: `Connected to ${accounts[0]}`,
          variant: "default"
        });
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (typeof window.ethereum !== 'undefined') {
      const ethereum = window.ethereum as ExtendedEip1193Provider;
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        const ethereum = window.ethereum as ExtendedEip1193Provider;
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [address, toast, disconnectWallet, refreshBalances]);

  return (
    <WalletContext.Provider value={{ address, rupayaBalance, bscBalance, connectWallet, disconnectWallet, refreshBalances }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};