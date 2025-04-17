
import React from "react";
import { useNavigate } from "react-router-dom";
import { CircleDollarSign, PlusCircle, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import PiButton from "@/components/PiButton";

interface DashboardHeaderProps {
  balance: number | null;
  isLoading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ balance, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <Card className="w-full md:w-auto p-4 flex items-center bg-gradient-to-r from-pi-purple to-indigo-600 text-white">
        <div className="mr-4 bg-white bg-opacity-20 h-12 w-12 rounded-full flex items-center justify-center">
          <CircleDollarSign size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-white text-opacity-90">Your Balance</p>
          <h2 className="text-2xl font-bold">
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              `π ${balance?.toFixed(2)}`
            )}
          </h2>
        </div>
      </Card>
      
      <div className="flex gap-3">
        <PiButton 
          variant="primary"
          className="flex-1"
          onClick={() => navigate('/create-payment')}
          iconLeft={<PlusCircle size={18} />}
        >
          Create Payment
        </PiButton>
        <PiButton 
          variant="secondary"
          className="flex-1"
          onClick={() => navigate('/payment-history')}
          iconLeft={<BarChart3 size={18} />}
        >
          View History
        </PiButton>
      </div>
    </div>
  );
};

export default DashboardHeader;
