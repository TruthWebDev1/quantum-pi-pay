
import React from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PiButton from "@/components/PiButton";
import { PiPayment } from "@/lib/piSdk";

interface TransactionListProps {
  payments: PiPayment[];
  isLoading: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ payments, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/payment-history')}
          className="text-pi-purple hover:text-pi-purple/80"
        >
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div className="w-1/3 h-5 bg-gray-200 rounded"></div>
                    <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-1/2 h-4 bg-gray-100 rounded mt-2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : payments.length > 0 ? (
          payments.map((payment) => (
            <TransactionItem key={payment.id} payment={payment} />
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-3 flex justify-center">
                <CreditCard size={32} className="text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-700">No transactions yet</h3>
              <p className="text-gray-500 text-sm mt-1">
                Start by creating your first payment link
              </p>
              <PiButton 
                className="mt-4"
                size="sm"
                onClick={() => navigate('/create-payment')}
              >
                Create Payment
              </PiButton>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const TransactionItem: React.FC<{ payment: PiPayment }> = ({ payment }) => {
  const navigate = useNavigate();
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={() => navigate(`/payment-details/${payment.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div 
              className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}
            >
              {payment.status === 'completed' ? (
                <CheckCircle size={16} />
              ) : payment.status === 'pending' ? (
                <Clock size={16} />
              ) : (
                <CreditCard size={16} />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{payment.memo}</p>
              <p className="text-xs text-gray-500">
                {payment.from ? `From: ${payment.from.username}` : 'Payment request'} • {formatDate(payment.created)}
              </p>
            </div>
          </div>
          <p className="font-semibold text-gray-900">π {payment.amount.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
