import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/firebase/init";
import { collection, addDoc, updateDoc, doc, query, where, orderBy, serverTimestamp, getDocs } from "firebase/firestore";
import { Transaction, VendorEarnings, UserSpending, PayoutRequest } from "@/interfaces/TransactionInterface";

interface TransactionState {
    // Transactions
    transactions: Transaction[];
    transactionsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    
    // Vendor earnings
    vendorEarnings: VendorEarnings | null;
    vendorEarningsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    
    // User spending
    userSpending: UserSpending | null;
    userSpendingStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    
    // Payout requests
    payoutRequests: PayoutRequest[];
    payoutRequestsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    
    // Shared
    error: string | null;
    lastUpdated: number;
}

const initialState: TransactionState = {
    transactions: [],
    transactionsStatus: 'idle',
    vendorEarnings: null,
    vendorEarningsStatus: 'idle',
    userSpending: null,
    userSpendingStatus: 'idle',
    payoutRequests: [],
    payoutRequestsStatus: 'idle',
    error: null,
    lastUpdated: 0,
};

// Create a transaction when an order is paid
export const createTransaction = createAsyncThunk(
    'transactions/createTransaction',
    async ({ 
        orderId, 
        userId, 
        vendorId, 
        amount, 
        paymentMethod, 
        paymentReference,
        platformCommissionRate = 0.05 // 5% platform commission
    }: { 
        orderId: string; 
        userId: string; 
        vendorId: string; 
        amount: number; 
        paymentMethod: string; 
        paymentReference?: string;
        platformCommissionRate?: number;
    }, { rejectWithValue }) => {
        try {
            const platformCommission = amount * platformCommissionRate;
            const vendorEarnings = amount - platformCommission;
            
            const transactionData = {
                orderId,
                userId,
                vendorId,
                type: 'payment' as const,
                amount,
                currency: 'USD',
                status: 'completed' as const,
                paymentMethod,
                paymentReference,
                description: `Payment for order #${orderId}`,
                createdAt: serverTimestamp(),
                platformCommission,
                vendorEarnings
            };

            const docRef = await addDoc(collection(db, 'transactions'), transactionData);
            
            // Update vendor earnings and user spending
            await Promise.all([
                updateVendorEarningsInFirestore(vendorId, vendorEarnings, amount),
                updateUserSpendingInFirestore(userId, amount)
            ]);

            return { id: docRef.id, ...transactionData };
        } catch (error) {
            console.error("Error creating transaction:", error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to create transaction');
        }
    }
);

// Helper function to update vendor earnings in Firestore
const updateVendorEarningsInFirestore = async (vendorId: string, earnings: number, orderAmount: number) => {
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format
    
    try {
        // Get current earnings data
        const vendorEarningsDoc = await getDocs(query(collection(db, 'vendorEarnings'), where('vendorId', '==', vendorId)));
        
        if (vendorEarningsDoc.empty) {
            // Create new vendor earnings record
            await addDoc(collection(db, 'vendorEarnings'), {
                vendorId,
                totalEarnings: earnings,
                totalOrders: 1,
                pendingEarnings: earnings,
                availableBalance: 0, // Will be available after payout processing
                totalWithdrawn: 0,
                averageOrderValue: orderAmount,
                lastUpdated: serverTimestamp(),
                monthlyEarnings: {
                    [currentMonth]: earnings
                }
            });
        } else {
            // Update existing vendor earnings
            const existingData = vendorEarningsDoc.docs[0].data() as VendorEarnings;
            const newTotalOrders = existingData.totalOrders + 1;
            const newTotalEarnings = existingData.totalEarnings + earnings;
            const monthlyEarnings = {
                ...existingData.monthlyEarnings,
                [currentMonth]: (existingData.monthlyEarnings[currentMonth] || 0) + earnings
            };
            
            await updateDoc(doc(db, 'vendorEarnings', vendorEarningsDoc.docs[0].id), {
                totalEarnings: newTotalEarnings,
                totalOrders: newTotalOrders,
                pendingEarnings: existingData.pendingEarnings + earnings,
                averageOrderValue: newTotalEarnings / newTotalOrders,
                lastUpdated: serverTimestamp(),
                monthlyEarnings
            });
        }
    } catch (error) {
        console.error('Error updating vendor earnings:', error);
    }
};

// Helper function to update user spending in Firestore
const updateUserSpendingInFirestore = async (userId: string, amount: number) => {
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format
    
    try {
        // Get current spending data
        const userSpendingDoc = await getDocs(query(collection(db, 'userSpending'), where('userId', '==', userId)));
        
        if (userSpendingDoc.empty) {
            // Create new user spending record
            await addDoc(collection(db, 'userSpending'), {
                userId,
                totalSpent: amount,
                totalOrders: 1,
                averageOrderValue: amount,
                lastOrderDate: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                monthlySpending: {
                    [currentMonth]: amount
                }
            });
        } else {
            // Update existing user spending
            const existingData = userSpendingDoc.docs[0].data() as UserSpending;
            const newTotalOrders = existingData.totalOrders + 1;
            const newTotalSpent = existingData.totalSpent + amount;
            const monthlySpending = {
                ...existingData.monthlySpending,
                [currentMonth]: (existingData.monthlySpending[currentMonth] || 0) + amount
            };
            
            await updateDoc(doc(db, 'userSpending', userSpendingDoc.docs[0].id), {
                totalSpent: newTotalSpent,
                totalOrders: newTotalOrders,
                averageOrderValue: newTotalSpent / newTotalOrders,
                lastOrderDate: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                monthlySpending
            });
        }
    } catch (error) {
        console.error('Error updating user spending:', error);
    }
};

// Fetch vendor earnings
export const fetchVendorEarnings = createAsyncThunk(
    'transactions/fetchVendorEarnings',
    async (vendorId: string, { rejectWithValue }) => {
        try {
            const q = query(collection(db, 'vendorEarnings'), where('vendorId', '==', vendorId));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                return null;
            }
            
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as unknown as VendorEarnings;
        } catch (error) {
            console.error("Error fetching vendor earnings:", error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch vendor earnings');
        }
    }
);

// Fetch user spending
export const fetchUserSpending = createAsyncThunk(
    'transactions/fetchUserSpending',
    async (userId: string, { rejectWithValue }) => {
        try {
            const q = query(collection(db, 'userSpending'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                return null;
            }
            
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as unknown as UserSpending;
        } catch (error) {
            console.error("Error fetching user spending:", error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user spending');
        }
    }
);

// Fetch transaction history
export const fetchTransactionHistory = createAsyncThunk(
    'transactions/fetchTransactionHistory',
    async ({ userId, vendorId }: { userId?: string; vendorId?: string }, { rejectWithValue }) => {
        try {
            let q;
            if (vendorId) {
                q = query(
                    collection(db, 'transactions'),
                    where('vendorId', '==', vendorId),
                    orderBy('createdAt', 'desc')
                );
            } else if (userId) {
                q = query(
                    collection(db, 'transactions'),
                    where('userId', '==', userId),
                    orderBy('createdAt', 'desc')
                );
            } else {
                throw new Error('Either userId or vendorId must be provided');
            }
            
            const querySnapshot = await getDocs(q);
            const transactions = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
                updatedAt: doc.data().updatedAt?.toDate()
            })) as Transaction[];
            
            return transactions;
        } catch (error) {
            console.error("Error fetching transaction history:", error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch transaction history');
        }
    }
);

// Request payout for vendor
export const requestPayout = createAsyncThunk(
    'transactions/requestPayout',
    async ({ 
        vendorId, 
        amount, 
        bankDetails 
    }: { 
        vendorId: string; 
        amount: number; 
        bankDetails: PayoutRequest['bankDetails'] 
    }, { rejectWithValue }) => {
        try {
            const payoutData = {
                vendorId,
                amount,
                requestedAt: serverTimestamp(),
                status: 'pending' as const,
                bankDetails
            };

            const docRef = await addDoc(collection(db, 'payoutRequests'), payoutData);
            return { id: docRef.id, ...payoutData };
        } catch (error) {
            console.error("Error requesting payout:", error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to request payout');
        }
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setTransactions: (state, action: PayloadAction<Transaction[]>) => {
            state.transactions = action.payload;
            state.lastUpdated = Date.now();
        },
        setVendorEarnings: (state, action: PayloadAction<VendorEarnings | null>) => {
            state.vendorEarnings = action.payload;
            state.lastUpdated = Date.now();
        },
        setUserSpending: (state, action: PayloadAction<UserSpending | null>) => {
            state.userSpending = action.payload;
            state.lastUpdated = Date.now();
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create transaction
            .addCase(createTransaction.pending, (state) => {
                state.transactionsStatus = 'loading';
                state.error = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.transactionsStatus = 'succeeded';
                state.transactions.unshift(action.payload as Transaction);
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.transactionsStatus = 'failed';
                state.error = action.payload as string;
            })
            
            // Fetch vendor earnings
            .addCase(fetchVendorEarnings.pending, (state) => {
                state.vendorEarningsStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchVendorEarnings.fulfilled, (state, action) => {
                state.vendorEarningsStatus = 'succeeded';
                state.vendorEarnings = action.payload;
            })
            .addCase(fetchVendorEarnings.rejected, (state, action) => {
                state.vendorEarningsStatus = 'failed';
                state.error = action.payload as string;
            })
            
            // Fetch user spending
            .addCase(fetchUserSpending.pending, (state) => {
                state.userSpendingStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchUserSpending.fulfilled, (state, action) => {
                state.userSpendingStatus = 'succeeded';
                state.userSpending = action.payload;
            })
            .addCase(fetchUserSpending.rejected, (state, action) => {
                state.userSpendingStatus = 'failed';
                state.error = action.payload as string;
            })
            
            // Fetch transaction history
            .addCase(fetchTransactionHistory.pending, (state) => {
                state.transactionsStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
                state.transactionsStatus = 'succeeded';
                state.transactions = action.payload;
            })
            .addCase(fetchTransactionHistory.rejected, (state, action) => {
                state.transactionsStatus = 'failed';
                state.error = action.payload as string;
            })
            
            // Request payout
            .addCase(requestPayout.pending, (state) => {
                state.payoutRequestsStatus = 'loading';
                state.error = null;
            })
            .addCase(requestPayout.fulfilled, (state, action) => {
                state.payoutRequestsStatus = 'succeeded';
                state.payoutRequests.unshift(action.payload as PayoutRequest);
            })
            .addCase(requestPayout.rejected, (state, action) => {
                state.payoutRequestsStatus = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const {
    setTransactions,
    setVendorEarnings,
    setUserSpending,
    setError,
    clearError
} = transactionSlice.actions;

// Selectors
export const selectTransactions = (state: { transactions: TransactionState }) => state.transactions.transactions;
export const selectTransactionsStatus = (state: { transactions: TransactionState }) => state.transactions.transactionsStatus;
export const selectVendorEarnings = (state: { transactions: TransactionState }) => state.transactions.vendorEarnings;
export const selectVendorEarningsStatus = (state: { transactions: TransactionState }) => state.transactions.vendorEarningsStatus;
export const selectUserSpending = (state: { transactions: TransactionState }) => state.transactions.userSpending;
export const selectUserSpendingStatus = (state: { transactions: TransactionState }) => state.transactions.userSpendingStatus;
export const selectTransactionsError = (state: { transactions: TransactionState }) => state.transactions.error;

export default transactionSlice.reducer;
