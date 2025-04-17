
import React, { useState } from 'react';
import { CheckCircle, Copy, Share2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/components/Layout';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import PiButton from '@/components/PiButton';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import PiSdk from '@/lib/piSdk';

// Form schema
const paymentSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(
    val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 
    "Amount must be greater than 0"
  ),
  description: z.string().min(1, "Description is required").max(100, "Description is too long"),
  notes: z.string().optional(),
  expiryDate: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const CreatePayment: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentCreated, setPaymentCreated] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: '',
      description: '',
      notes: '',
      expiryDate: '',
    },
  });
  
  const onSubmit = async (values: PaymentFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create payment request via Pi SDK
      const paymentId = await PiSdk.createPayment(
        parseFloat(values.amount),
        values.description
      );
      
      // Get the payment link
      const link = PiSdk.getPaymentLink(paymentId);
      setPaymentLink(link);
      
      // Show success
      toast({
        title: "Payment created",
        description: "Your Pi payment link is ready to be shared",
        duration: 3000,
      });
      
      setPaymentCreated(true);
    } catch (error) {
      console.error('Failed to create payment:', error);
      toast({
        title: "Payment creation failed",
        description: "Could not create your payment request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast({
          title: "Failed to copy",
          description: "Please try again",
          variant: "destructive",
        });
      });
  };
  
  const handleShare = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: 'Pi Payment Request',
          text: 'Here is my Pi payment request. Pay securely with Pi!',
          url: paymentLink,
        })
        .catch(err => console.error('Error sharing:', err));
      } else {
        toast({
          title: "Share not supported",
          description: "Try copying the link instead",
          variant: "default",
        });
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };
  
  const handleReset = () => {
    form.reset();
    setPaymentCreated(false);
    setPaymentLink('');
  };
  
  return (
    <Layout title="Create Payment" showBackButton>
      <div className="max-w-xl mx-auto animate-fade-in">
        {!paymentCreated ? (
          <>
            <p className="text-gray-600 mb-6">
              Create a new payment request to receive Pi from your customers, clients, or friends.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (π)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          min="0"
                          className="text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What's this payment for?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any details about this payment..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <PiButton
                    type="submit"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    Create Payment Link
                  </PiButton>
                </div>
              </form>
            </Form>
          </>
        ) : (
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pi-purple to-indigo-600 py-6 px-4 text-center">
              <div className="rounded-full bg-white h-12 w-12 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-pi-purple" />
              </div>
              <h2 className="text-xl font-bold text-white">Payment Ready!</h2>
              <p className="text-white text-opacity-90 mt-1">
                Your Pi payment link has been created
              </p>
            </div>
            
            <CardContent className="p-6">
              <div className="flex justify-center mb-6">
                <QRCodeGenerator value={paymentLink} size={200} />
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Link</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={paymentLink}
                    readOnly
                    className="flex-1 rounded-l-lg border border-gray-300 py-2 px-3 text-sm bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    className="rounded-l-none border-l-0"
                    onClick={handleCopyLink}
                  >
                    {linkCopied ? (
                      <CheckCircle size={18} className="text-green-600" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="w-full"
                >
                  <Share2 size={18} className="mr-2" />
                  Share
                </Button>
                
                <PiButton
                  variant="primary"
                  onClick={handleReset}
                  className="w-full"
                >
                  Create New
                </PiButton>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-12">
          <Separator className="my-4" />
          <h3 className="text-sm font-medium text-gray-900 mb-2">About Pi Payments</h3>
          <p className="text-xs text-gray-600">
            QuantumPay makes it easy to accept Pi cryptocurrency payments from anyone. Your payment links are secure
            and all transactions happen directly on the Pi blockchain. No private keys are stored by our service.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePayment;
