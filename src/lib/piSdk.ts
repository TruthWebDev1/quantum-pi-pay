
// Mock implementation of Pi SDK
// In a real app, you would use the actual Pi SDK

export interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
}

export interface PiPayment {
  id: string;
  amount: number;
  memo: string;
  status: 'pending' | 'completed' | 'failed';
  created: Date;
  from?: {
    uid: string;
    username: string;
  };
  to?: {
    uid: string;
    username: string;
  };
}

let currentUser: PiUser | null = null;

// Mock payments data
const mockPayments: PiPayment[] = [
  {
    id: 'pay_123456789',
    amount: 5,
    memo: 'Coffee payment',
    status: 'completed',
    created: new Date(Date.now() - 86400000 * 2), // 2 days ago
    from: {
      uid: 'user123',
      username: 'alice_pi',
    }
  },
  {
    id: 'pay_987654321',
    amount: 25,
    memo: 'Website design',
    status: 'completed',
    created: new Date(Date.now() - 86400000 * 5), // 5 days ago
    from: {
      uid: 'user456',
      username: 'bob_dev',
    }
  },
  {
    id: 'pay_543216789',
    amount: 10,
    memo: 'Dinner split',
    status: 'pending',
    created: new Date(),
    from: {
      uid: 'user789',
      username: 'carol_pi',
    }
  },
];

const PiSdk = {
  // Authentication
  authenticate: async (): Promise<PiUser> => {
    // Simulating authentication delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock successful authentication
    currentUser = {
      uid: 'user123',
      username: 'john_pi',
      accessToken: 'mock_token_xyz'
    };
    
    return currentUser;
  },
  
  // Get current user
  getCurrentUser: (): PiUser | null => {
    return currentUser;
  },
  
  // Sign out
  signOut: async (): Promise<void> => {
    currentUser = null;
    await new Promise(resolve => setTimeout(resolve, 300));
  },
  
  // Get user balance
  getUserBalance: async (): Promise<number> => {
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return 42.5; // Mock Pi balance
  },
  
  // Create a payment
  createPayment: async (amount: number, memo: string): Promise<string> => {
    // Mock payment creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    const paymentId = `pay_${Date.now()}`;
    
    // Add to mock payments
    mockPayments.unshift({
      id: paymentId,
      amount,
      memo,
      status: 'pending',
      created: new Date()
    });
    
    return paymentId;
  },
  
  // Get payment link
  getPaymentLink: (paymentId: string): string => {
    return `https://quantum.pi/pay/${paymentId}`;
  },
  
  // Get payment details
  getPayment: async (paymentId: string): Promise<PiPayment | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPayments.find(p => p.id === paymentId) || null;
  },
  
  // Get payment history
  getPaymentHistory: async (): Promise<PiPayment[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return [...mockPayments];
  },
};

export default PiSdk;
