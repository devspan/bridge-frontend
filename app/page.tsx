// app/page.tsx
'use client'

import { useState } from 'react'
import BridgingInterface from '@/components/BridgingInterface'
import IntroductionSection from '@/components/IntroductionSection'
import { useEthers } from '../hooks/useEthers'
import ConnectWalletButton from '@/components/ConnectWalletButton'

export default function Home() {
  const { address } = useEthers()

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <IntroductionSection />
      {address ? (
        <BridgingInterface connectedAddress={address} />
      ) : (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">To use the Rupaya Bridge, please connect your wallet.</p>
          <ConnectWalletButton />
        </div>
      )}
    </div>
  )
}