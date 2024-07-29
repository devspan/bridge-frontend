import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

export const RUPAYA_RPC_URL = process.env.NEXT_PUBLIC_RUPAYA_RPC_URL;
export const BINANCE_TESTNET_RPC_URL = process.env.NEXT_PUBLIC_BINANCE_TESTNET_RPC_URL;
export const RUPAYA_BRIDGE_ADDRESS = process.env.NEXT_PUBLIC_RUPAYA_BRIDGE_ADDRESS;
export const BINANCE_BRIDGE_ADDRESS = process.env.NEXT_PUBLIC_BINANCE_BRIDGE_ADDRESS;

if (!RUPAYA_RPC_URL || !BINANCE_TESTNET_RPC_URL) {
  throw new Error('RPC URLs are not defined in the environment variables');
}

if (!RUPAYA_BRIDGE_ADDRESS || !BINANCE_BRIDGE_ADDRESS) {
  throw new Error('Bridge addresses are not defined in the environment variables');
}

export const rupayaProvider = new ethers.JsonRpcProvider(RUPAYA_RPC_URL);
export const binanceProvider = new ethers.JsonRpcProvider(BINANCE_TESTNET_RPC_URL);

export const rupayaBridgeABI = [
  "function deposit() payable",
  "function withdraw(address to, uint256 amount)",
  "function maxTransferAmount() view returns (uint256)",
  "function transferCooldown() view returns (uint256)",
  "event Deposit(address indexed from, uint256 amount, uint256 timestamp)",
  "event Withdraw(address indexed to, uint256 amount, uint256 timestamp)"
] as const;

export const binanceBridgeABI = [
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "function balanceOf(address account) view returns (uint256)",
  "function maxTransferAmount() view returns (uint256)",
  "function transferCooldown() view returns (uint256)",
  "event Burn(address indexed from, uint256 amount, uint256 timestamp)",
  "event Mint(address indexed to, uint256 amount, uint256 timestamp)"
] as const;

interface RupayaBridge extends ethers.BaseContract {
  deposit(overrides?: ethers.TransactionRequest & { value?: ethers.BigNumberish }): Promise<ethers.ContractTransactionResponse>;
  withdraw(to: string, amount: ethers.BigNumberish): Promise<ethers.ContractTransactionResponse>;
  maxTransferAmount(): Promise<bigint>;
  transferCooldown(): Promise<bigint>;
}

interface BinanceBridge extends ethers.BaseContract {
  mint(to: string, amount: ethers.BigNumberish): Promise<ethers.ContractTransactionResponse>;
  burn(amount: ethers.BigNumberish): Promise<ethers.ContractTransactionResponse>;
  balanceOf(account: string): Promise<bigint>;
  maxTransferAmount(): Promise<bigint>;
  transferCooldown(): Promise<bigint>;
}

export const rupayaBridge = new ethers.Contract(RUPAYA_BRIDGE_ADDRESS, rupayaBridgeABI, rupayaProvider) as unknown as RupayaBridge;
export const binanceBridge = new ethers.Contract(BINANCE_BRIDGE_ADDRESS, binanceBridgeABI, binanceProvider) as unknown as BinanceBridge;

export const getSigner = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner();
  } else {
    throw new Error("Ethereum wallet is not detected. Please install MetaMask or another Ethereum-compatible wallet.");
  }
}

export const getContractWithSigner = async <T extends ethers.BaseContract>(contract: T): Promise<T> => {
  const signer = await getSigner();
  return contract.connect(signer) as T;
}

export const checkNetwork = async (expectedChainId: number) => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (parseInt(chainId as string, 16) !== expectedChainId) {
      throw new Error(`Please switch to the correct network in your wallet. Expected chain ID: ${expectedChainId}`);
    }
  } else {
    throw new Error("Ethereum wallet is not detected. Please install MetaMask or another Ethereum-compatible wallet.");
  }
}

export const parseEther = ethers.parseEther;
export const formatEther = ethers.formatEther;

export const getUserBalance = async (userAddress: string): Promise<bigint> => {
  return binanceBridge.balanceOf(userAddress);
}