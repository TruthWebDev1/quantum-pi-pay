
import React from "react";
import { TrendingUp, Clock, CheckCircle } from "lucide-react";
import PaymentCard from "@/components/PaymentCard";
import { PiPayment } from "@/lib/piSdk";

interface DashboardStatsProps {
  payments: PiPayment[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ payments }) => {
  const totalReceived = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
    
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  
  const completedPayments = payments.filter(p => p.status === 'completed');

  return (
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
  );
};

export default DashboardStats;
