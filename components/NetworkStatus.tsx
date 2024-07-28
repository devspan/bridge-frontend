'use client'

import React, { useState, useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast"

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "You're back online",
        description: "Your connection has been restored.",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You're offline",
        description: "Please check your internet connection.",
        variant: "destructive"
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [toast])

  return (
    <div className={`fixed bottom-4 right-4 p-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
      <div className="w-3 h-3 rounded-full bg-white"></div>
    </div>
  )
}

export default NetworkStatus