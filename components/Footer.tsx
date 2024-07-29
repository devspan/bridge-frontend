import React from 'react'
import { FaHome, FaSearch, FaTwitter, FaDiscord } from 'react-icons/fa'

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 p-8 mt-16 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-8 md:mb-0 space-y-4">
          <h3 className="font-bold text-lg text-gray-700 dark:text-gray-300">Quick Links</h3>
          <div className="flex space-x-4">
            <a href="https://rupaya.io" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              <FaHome className="mr-2" /> Home
            </a>
            <a href="https://scan.testnet.rupaya.io" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              <FaSearch className="mr-2" /> Explorer
            </a>
            <a href="https://twitter.com/rupayacoin" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              <FaTwitter className="mr-2" /> Twitter
            </a>
            <a href="https://discord.gg/rupaya" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              <FaDiscord className="mr-2" /> Discord
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-gray-700 dark:text-gray-300">Contact</h3>
          <p className="text-gray-600 dark:text-gray-400">support@rupaya.io</p>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
        © 2024 Rupaya Bridge. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer