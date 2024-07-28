// app/components/BridgingInterface.tsx
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaExchangeAlt, FaTrash } from 'react-icons/fa'
import { rupayaBridge, binanceBridge, getContractWithSigner, checkNetwork, parseEther, formatEther } from '@/lib/ethers'
import TransactionModal from './TransactionModal'

interface BridgeTransaction {
  date: string
  from: string
  to: string
  amount: string
  status: string
  txHash: string
}

interface BridgingInterfaceProps {
  connectedAddress: string
}

export default function BridgingInterface({ connectedAddress }: BridgingInterfaceProps) {
  const [sourceChain, setSourceChain] = useState('')
  const [destinationChain, setDestinationChain] = useState('')
  const [amount, setAmount] = useState('')
  const [transactionStatus, setTransactionStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([])
  const [maxTransferAmount, setMaxTransferAmount] = useState('')
  const [transferCooldown, setTransferCooldown] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const storedTransactions = localStorage.getItem(`bridgeTransactions_${connectedAddress}`)
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions))
    }
  }, [connectedAddress])

  const updateBridgeInfo = useCallback(async () => {
    if (!sourceChain) return

    try {
      const contract = sourceChain === 'rupaya' ? 
        await getContractWithSigner(rupayaBridge) : 
        await getContractWithSigner(binanceBridge)

      try {
        const maxAmount = await contract.maxTransferAmount()
        setMaxTransferAmount(formatEther(maxAmount))
      } catch (error) {
        console.error("Error fetching maxTransferAmount:", error)
        setMaxTransferAmount("Error fetching")
      }

      try {
        const cooldown = await contract.transferCooldown()
        setTransferCooldown(cooldown.toString())
      } catch (error) {
        console.error("Error fetching transferCooldown:", error)
        setTransferCooldown("Error fetching")
      }
    } catch (error) {
      console.error("Error fetching bridge info:", error)
      setMaxTransferAmount("Error")
      setTransferCooldown("Error")
    }
  }, [sourceChain])

  useEffect(() => {
    updateBridgeInfo()
  }, [updateBridgeInfo])

  const handleSubmit = async () => {
    if (!sourceChain || !destinationChain || !amount) {
      toast({ title: "Please fill all fields", variant: "destructive" })
      return
    }

    if (sourceChain === destinationChain) {
      toast({ title: "Source and destination chains must be different", variant: "destructive" })
      return
    }

    if (Number(amount) > Number(maxTransferAmount)) {
      toast({ title: `Amount exceeds maximum transfer limit of ${maxTransferAmount} RUPX`, variant: "destructive" })
      return
    }

    try {
      setIsLoading(true)
      setTransactionStatus('Processing...')
      let tx: ethers.ContractTransactionResponse
      let receipt: ethers.TransactionReceipt | null = null

      if (sourceChain === 'rupaya' && destinationChain === 'bsc') {
        await checkNetwork(799) // Rupaya testnet chain ID
        const rupayaBridgeWithSigner = await getContractWithSigner(rupayaBridge)
        tx = await rupayaBridgeWithSigner.deposit({ value: parseEther(amount) })
        receipt = await tx.wait()
        addTransaction('Rupaya', 'BSC', amount, 'Completed', receipt?.hash || '')
        toast({ title: "Deposit successful", description: "Tokens have been deposited to the Rupaya bridge." })
      } else if (sourceChain === 'bsc' && destinationChain === 'rupaya') {
        await checkNetwork(97) // BSC testnet chain ID
        const binanceBridgeWithSigner = await getContractWithSigner(binanceBridge)
        tx = await binanceBridgeWithSigner.burn(parseEther(amount))
        receipt = await tx.wait()
        addTransaction('BSC', 'Rupaya', amount, 'Completed', receipt?.hash || '')
        toast({ title: "Burn successful", description: "Tokens have been burned on the Binance bridge." })
      }

      setTransactionStatus('Completed')
      if (receipt?.hash) {
        setTransactionHash(receipt.hash)
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error(error)
      setTransactionStatus('Failed')
      toast({ 
        title: "Transaction failed", 
        description: error instanceof Error ? error.message : "An error occurred while processing the transaction.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTransaction = (from: string, to: string, amount: string, status: string, txHash: string) => {
    const newTransaction: BridgeTransaction = {
      date: new Date().toISOString(),
      from,
      to,
      amount,
      status,
      txHash
    }
    const updatedTransactions = [...transactions, newTransaction]
    setTransactions(updatedTransactions)
    localStorage.setItem(`bridgeTransactions_${connectedAddress}`, JSON.stringify(updatedTransactions))
  }

  const clearHistory = () => {
    setTransactions([])
    localStorage.removeItem(`bridgeTransactions_${connectedAddress}`)
    toast({ title: "Transaction history cleared" })
  }

  const getExplorerUrl = (txHash: string, chain: string) => {
    if (chain === 'rupaya') {
      return `https://explorer.rupaya.io/tx/${txHash}`
    } else if (chain === 'bsc') {
      return `https://testnet.bscscan.com/tx/${txHash}`
    }
    return ''
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Rupaya Bridge</CardTitle>
        <CardDescription>Transfer your RUPX tokens between networks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Connected Wallet: {connectedAddress}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Max Transfer Amount: {maxTransferAmount} RUPX</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Transfer Cooldown: {transferCooldown} seconds</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select onValueChange={(value) => setSourceChain(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select source chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rupaya">Rupaya</SelectItem>
                <SelectItem value="bsc">Binance Smart Chain</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setDestinationChain(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rupaya">Rupaya</SelectItem>
                <SelectItem value="bsc">Binance Smart Chain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
            <FaExchangeAlt className="mr-2" />
            Bridge Tokens
          </Button>

          {transactionStatus && (
            <div className={`p-4 rounded ${
              transactionStatus === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
              transactionStatus === 'Failed' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
              'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
            }`}>
              Status: {transactionStatus}
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <Button variant="outline" size="sm" onClick={clearHistory}>
                <FaTrash className="mr-2" />
                Clear History
              </Button>
            </div>

            <Table>
              <TableCaption>A list of your recent transactions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(tx.date).toLocaleString()}</TableCell>
                    <TableCell>{tx.from}</TableCell>
                    <TableCell>{tx.to}</TableCell>
                    <TableCell>{tx.amount} RUPX</TableCell>
                    <TableCell>{tx.status}</TableCell>
                    <TableCell>
                      <a 
                        href={getExplorerUrl(tx.txHash, tx.from)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                      >
                        {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionHash={transactionHash}
        chainExplorerUrl={sourceChain === 'rupaya' ? 'https://scan.testnet.rupaya.io' : 'https://testnet.bscscan.com'}
      />
    </Card>
  )
}