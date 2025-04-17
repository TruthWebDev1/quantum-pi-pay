
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Copy, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PiButton from "@/components/PiButton";
import { toast } from "@/components/ui/use-toast";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [transactionId, setTransactionId] = useState("tx_12345678");
  const [idCopied, setIdCopied] = useState(false);
  
  // Create confetti elements
  useEffect(() => {
    const confettiCount = 100;
    const container = document.getElementById("confetti-container");
    
    if (container) {
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement("div");
        confetti.className = "animate-confetti absolute";
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = "0";
        confetti.style.width = `${Math.random() * 8 + 5}px`;
        confetti.style.height = `${Math.random() * 16 + 8}px`;
        confetti.style.backgroundColor = [
          "#8b5cf6", // pi-purple
          "#fcd34d", // pi-gold
          "#f472b6", // pink
          "#34d399", // green
        ][Math.floor(Math.random() * 4)];
        confetti.style.borderRadius = "2px";
        confetti.style.animationDelay = `${Math.random() * 1.5}s`;
        confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
        
        container.appendChild(confetti);
      }
    }
    
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);
  
  const handleCopyId = () => {
    navigator.clipboard.writeText(transactionId)
      .then(() => {
        setIdCopied(true);
        setTimeout(() => setIdCopied(false), 2000);
        
        toast({
          title: "Copied to clipboard",
          description: "Transaction ID copied",
          duration: 2000,
        });
      })
      .catch(err => {
        console.error("Failed to copy:", err);
      });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
      {/* Confetti container */}
      <div id="confetti-container" className="absolute inset-0 pointer-events-none overflow-hidden"></div>
      
      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="flex justify-center mb-8">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600 animate-pulse-scale" />
          </div>
        </div>
        
        <Card className="shadow-lg border-0">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              You've just made a Pi-powered payment
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Amount</p>
                <p className="text-2xl font-bold text-gray-900">π 15.00</p>
              </div>
              
              <Separator className="my-3" />
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Paid to</p>
                <p className="text-gray-900">QuantumPay Store</p>
              </div>
              
              <Separator className="my-3" />
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                <div className="flex items-center justify-center">
                  <p className="text-gray-900 text-sm font-mono mr-2">{transactionId}</p>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleCopyId}
                    className="h-6 w-6"
                  >
                    {idCopied ? (
                      <CheckCircle size={14} className="text-green-600" />
                    ) : (
                      <Copy size={14} className="text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <PiButton
                onClick={() => navigate('/dashboard')}
                iconLeft={<Home size={18} />}
              >
                Go to Dashboard
              </PiButton>
              
              <Button
                variant="outline"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={18} className="mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            This transaction has been securely recorded on the Pi blockchain.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
