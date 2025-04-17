
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleDollarSign, TrendingUp, Clock, CheckCircle, CreditCard, PlusCircle, BarChart3 } from "lucide-react";
import Layout from "@/components/Layout";
import PiButton from "@/components/PiButton";
import PaymentCard from "@/components/PaymentCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PiSdk, { PiPayment } from "@/lib/piSdk";
import { toast } from "@/components/ui/use-toast";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentPayments, setRecentPayments] = useState<PiPayment[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        // Load user balance
        const userBalance = await PiSdk.getUserBalance();
        setBalance(userBalance);
        
        // Load recent payments
        const payments = await PiSdk.getPaymentHistory();
        setRecentPayments(payments.slice(0, 3)); // Get only the 3 most recent
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast({
          title: "Error loading data",
          description: "Could not fetch your account information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calculate stats
  const totalReceived = recentPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
    
  const pendingPayments = recentPayments.filter(p => p.status === 'pending');
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  
  const completedPayments = recentPayments.filter(p => p.status === 'completed');

  return (
    <Layout title="Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Balance and actions */}
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
              variant="gold"
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
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PaymentCard 
            title="Total Received"
            value={totalReceived}
            description="Total completed payments"
            trend={{ value: 12, positive: true }}
            icon={<TrendingUp size={18} />}
          />
          
          <PaymentCard 
            title="Pending Payments"
            value={pendingAmount}
            description={`${pendingPayments.length} pending transactions`}
            icon={<Clock size={18} />}
            status="pending"
          />
          
          <PaymentCard 
            title="Completed Payments"
            value={completedPayments.length}
            description="Successfully processed"
            icon={<CheckCircle size={18} />}
            status="completed"
          />
        </div>
        
        {/* Recent transactions */}
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
            ) : recentPayments.length > 0 ? (
              recentPayments.map((payment) => (
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
      </div>
    </Layout>
  );
};

interface TransactionItemProps {
  payment: PiPayment;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ payment }) => {
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

export default Dashboard;
