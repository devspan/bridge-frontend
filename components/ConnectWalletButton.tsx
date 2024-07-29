// app/components/ConnectWalletButton.tsx
'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { useWallet } from '@/app/contexts/WalletContext';
import { FaWallet } from 'react-icons/fa';

const ConnectWalletButton: React.FC = () => {
  const { address, connectWallet, disconnectWallet } = useWallet();

  if (address) {
    return (
      <Button variant="outline" onClick={disconnectWallet}>
        <FaWallet className="mr-2" />
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={connectWallet}>
      <FaWallet className="mr-2" />
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletButton;