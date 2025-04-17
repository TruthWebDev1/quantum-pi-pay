
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Filter, CheckCircle, Clock, XCircle, Search } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PiSdk, { PiPayment } from "@/lib/piSdk";
import { toast } from "@/components/ui/use-toast";

const PaymentHistory: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PiPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PiPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setIsLoading(true);
        const history = await PiSdk.getPaymentHistory();
        setPayments(history);
        setFilteredPayments(history);
      } catch (error) {
        console.error("Failed to load payment history:", error);
        toast({
          title: "Error",
          description: "Failed to load payment history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  // Filter payments whenever filter or search changes
  useEffect(() => {
    let result = [...payments];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(payment => payment.status === statusFilter);
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(payment => 
        payment.memo.toLowerCase().includes(query) || 
        payment.id.toLowerCase().includes(query) ||
        (payment.from?.username?.toLowerCase().includes(query) || false)
      );
    }
    
    setFilteredPayments(result);
  }, [statusFilter, searchQuery, payments]);

  const handleExportCSV = () => {
    try {
      // Convert payments to CSV format
      const headers = ["Date", "Description", "Amount", "Status", "From", "ID"];
      
      const csvContent = [
        headers.join(","),
        ...filteredPayments.map(payment => {
          const date = new Date(payment.created).toLocaleDateString();
          const description = `"${payment.memo.replace(/"/g, '""')}"`;
          const amount = payment.amount;
          const status = payment.status;
          const from = payment.from?.username || "N/A";
          const id = payment.id;
          
          return [date, description, amount, status, from, id].join(",");
        })
      ].join("\n");
      
      // Create a blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `pi_payments_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "Your payment history has been exported to CSV",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export failed",
        description: "Could not export payment history",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle size={14} />
            <span>Completed</span>
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <Clock size={14} />
            <span>Pending</span>
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle size={14} />
            <span>Failed</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout title="Payment History" showBackButton>
      <div className="space-y-6 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-3">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[160px]">
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={isLoading || filteredPayments.length === 0}
            >
              <Download size={18} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Payments table */}
        <Card>
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredPayments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>From</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow 
                      key={payment.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/payment-details/${payment.id}`)}
                    >
                      <TableCell>{formatDate(payment.created)}</TableCell>
                      <TableCell>{payment.memo}</TableCell>
                      <TableCell className="font-medium">π {payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>{payment.from?.username || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto rounded-full bg-gray-100 h-12 w-12 flex items-center justify-center mb-4">
                <Filter size={20} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No payments found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters to see more results"
                  : "You haven't received any payments yet"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button 
                  onClick={() => navigate('/create-payment')}
                  variant="outline"
                >
                  Create Your First Payment
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentHistory;
