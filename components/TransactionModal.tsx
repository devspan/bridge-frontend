import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  transactionHash: string
  chainExplorerUrl: string
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, transactionHash, chainExplorerUrl }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Submitted</DialogTitle>
          <DialogDescription>
            Your transaction has been submitted successfully.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Transaction Hash:
          </p>
          <p className="font-mono text-xs break-all">{transactionHash}</p>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => window.open(`${chainExplorerUrl}/tx/${transactionHash}`, '_blank')}>
            View on Explorer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionModal