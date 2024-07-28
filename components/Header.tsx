// app/components/Header.tsx
import React from 'react'
import { FaHome, FaSearch, FaTwitter, FaDiscord } from 'react-icons/fa'
import { ModeToggle } from './mode-toggle'
import ConnectWalletButton from './ConnectWalletButton'
import Link from 'next/link'

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Rupaya Bridge</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink href="https://rupaya.io" icon={<FaHome />} text="Home" />
            <NavLink href="https://explorer.rupaya.io" icon={<FaSearch />} text="Explorer" />
            <NavLink href="https://twitter.com/rupayacoin" icon={<FaTwitter />} text="Twitter" />
            <NavLink href="https://discord.gg/rupaya" icon={<FaDiscord />} text="Discord" />
          </nav>
          <div className="flex items-center space-x-4">
            <ConnectWalletButton />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

const NavLink: React.FC<{ href: string; icon: React.ReactNode; text: string }> = ({ href, icon, text }) => (
  <Link href={href} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
    {icon}
    <span className="ml-1">{text}</span>
  </Link>
)

export default Header