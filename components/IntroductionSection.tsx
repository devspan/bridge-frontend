import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaRocket, FaShieldAlt, FaCoins, FaExchangeAlt, FaTimes, FaInfoCircle } from 'react-icons/fa';

const IntroductionSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const storedVisibility = localStorage.getItem('introductionSectionVisible');
    if (storedVisibility !== null) {
      setIsVisible(JSON.parse(storedVisibility));
    }
  }, []);

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem('introductionSectionVisible', JSON.stringify(newVisibility));
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="mb-4 text-muted-foreground hover:text-foreground"
        onClick={toggleVisibility}
      >
        <FaInfoCircle className="mr-2" />
        Show Introduction
      </Button>
    );
  }

  return (
    <Card className="bg-background border-border shadow-lg mb-6 relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        onClick={toggleVisibility}
      >
        <FaTimes />
      </Button>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-foreground pr-8">Welcome to the Future of Cross-Chain Transfers</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">
          Seamlessly transfer your RUPX tokens between Rupaya and Binance Smart Chain networks,
          unlocking new DeFi opportunities and maximizing the potential of your assets.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-card-foreground flex items-center">
              <FaRocket className="mr-2 text-primary" />
              Fast Transfers
            </h3>
            <p className="text-muted-foreground">Experience lightning-fast token transfers between networks.</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-card-foreground flex items-center">
              <FaShieldAlt className="mr-2 text-secondary" />
              Enhanced Security
            </h3>
            <p className="text-muted-foreground">Your assets are protected by state-of-the-art security measures.</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-card-foreground flex items-center">
              <FaCoins className="mr-2 text-accent" />
              Low Fees
            </h3>
            <p className="text-muted-foreground">Enjoy minimal transaction costs for all your bridging operations.</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-card-foreground flex items-center">
              <FaExchangeAlt className="mr-2 text-destructive" />
              Expand Your DeFi Horizon
            </h3>
            <p className="text-muted-foreground">Access a wider range of DeFi protocols across multiple networks.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">Fast</Badge>
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">Secure</Badge>
          <Badge variant="secondary" className="bg-accent text-accent-foreground">Low Fees</Badge>
          <Badge variant="secondary" className="bg-destructive text-destructive-foreground">Cross-Chain</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntroductionSection;