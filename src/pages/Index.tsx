
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, LogIn, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PiButton from '@/components/PiButton';
import PiSdk from '@/lib/piSdk';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handlePiLogin = async () => {
    try {
      setIsLoading(true);
      await PiSdk.authenticate();
      
      // Show success toast
      toast({
        title: "Login successful",
        description: "Welcome to QuantumPay",
        duration: 3000,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: "Could not connect to Pi Network",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo and app name */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-pi-purple text-white text-3xl font-bold mb-4 shadow-lg">
            Q
          </div>
          <h1 className="text-3xl font-bold text-gray-900">QuantumPay</h1>
          <p className="text-gray-500 mt-2 text-center">The Stripe of the Pi Network</p>
        </div>
        
        {/* Login card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Log in with your Pi Wallet to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="font-medium text-gray-900 mb-2">Why use QuantumPay?</h3>
              
              <div className="space-y-3">
                <Feature icon={<CircleCheck size={16} className="text-green-500" />} text="Create and share payment links easily" />
                <Feature icon={<CircleCheck size={16} className="text-green-500" />} text="Accept Pi payments securely" />
                <Feature icon={<CircleCheck size={16} className="text-green-500" />} text="Track your transactions in real-time" />
              </div>
            </div>
            
            <PiButton
              className="w-full py-6 text-base"
              onClick={handlePiLogin}
              isLoading={isLoading}
              iconLeft={<Wallet size={20} />}
            >
              Login with Pi Wallet
            </PiButton>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-sm text-center text-gray-500">
              All transactions happen directly in the Pi Blockchain.
              <br />No private keys are stored.
            </div>
          </CardFooter>
        </Card>
        
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} QuantumPay | All rights reserved</p>
          <div className="mt-2 flex justify-center">
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              Built with Pi SDK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureProps {
  icon: React.ReactNode;
  text: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, text }) => (
  <div className="flex items-center">
    <div className="mr-2">{icon}</div>
    <span className="text-sm text-gray-700">{text}</span>
  </div>
);

export default Index;
