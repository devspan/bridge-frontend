import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export function useEthers() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider)
        setProvider(provider)

        try {
          const signer = await provider.getSigner()
          setSigner(signer)
          const address = await signer.getAddress()
          setAddress(address)
        } catch (error) {
          console.error('Failed to get signer:', error)
        }
      }
    }

    init()
  }, [])

  return { provider, signer, address }
}