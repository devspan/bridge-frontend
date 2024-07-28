'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { useEthers } from '@/hooks/useEthers'

const WalletButton: React.FC = () => {
  const { address, signer } = useEthers()

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  return (
    <Button onClick={address ? undefined : connectWallet}>
      {address 
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : 'Connect Wallet'
      }
    </Button>
  )
}

export default WalletButton