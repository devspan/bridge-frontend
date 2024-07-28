// app/components/IntroductionSection.tsx
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const IntroductionSection: React.FC = () => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Welcome to Rupaya Bridge</CardTitle>
        <CardDescription>Seamlessly transfer your RUPX tokens between networks</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Rupaya Bridge allows you to easily transfer your RUPX tokens between Rupaya and Binance Smart Chain networks,
          expanding your DeFi opportunities and enhancing the utility of your tokens.
        </p>
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Key Benefits:</h3>
        <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-300">
          <li>Fast and secure transfers</li>
          <li>Low transaction fees</li>
          <li>User-friendly interface</li>
          <li>Expand your DeFi possibilities</li>
        </ul>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Fast</Badge>
          <Badge variant="outline">Secure</Badge>
          <Badge variant="outline">Low Fees</Badge>
          <Badge variant="outline">Cross-Chain</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default IntroductionSection