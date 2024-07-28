// app/components/ConnectWalletButton.tsx
'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useEthers } from '@/hooks/useEthers'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const ConnectWalletButton: React.FC = () => {
  const { address, connectWallet } = useEthers()
  const [isOpen, setIsOpen] = useState(false)

  const handleConnect = async () => {
    await connectWallet()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {address 
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : 'Connect Wallet'
          }
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to the Rupaya Bridge.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={handleConnect}>
            Connect with MetaMask
          </Button>
          {/* Add more wallet options here */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConnectWalletButton