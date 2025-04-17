
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import PiSdk, { PiPayment } from "@/lib/piSdk";
import { toast } from "@/components/ui/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import TransactionList from "@/components/dashboard/TransactionList";

const Dashboard: React.FC = () => {
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

  return (
    <Layout title="Dashboard">
      <div className="space-y-6 animate-fade-in">
        <DashboardHeader balance={balance} isLoading={isLoading} />
        <DashboardStats payments={recentPayments} />
        <TransactionList payments={recentPayments} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default Dashboard;
