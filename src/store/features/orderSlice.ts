import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/firebase/init";
import { collection, getDocs, updateDoc, doc, query, orderBy, addDoc, serverTimestamp, where, onSnapshot, Timestamp } from "firebase/firestore";
import { Order } from "@/interfaces/OrderInterface";
import { FirebaseError } from "firebase/app";

interface OrderState {
    // Restaurant orders (for vendor dashboard)
    restaurantOrders: Order[];
    restaurantOrdersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    
    // User orders (for tracking)
    userOrders: Order[];
    selectedOrderId: string | null;
    userOrdersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    
    // Shared
    error: string | null;
    lastUpdated: number;
}

const initialState: OrderState = {
    restaurantOrders: [],
    restaurantOrdersStatus: 'idle',
    userOrders: [],
    selectedOrderId: null,
    userOrdersStatus: 'idle',
    error: null,
    lastUpdated: 0,
};

// Async thunk to fetch all orders for a restaurant (vendor dashboard)
export const fetchRestaurantOrders = createAsyncThunk(
    'orders/fetchRestaurantOrders',
    async (restaurantId: string, { rejectWithValue }) => {
        try {
            const ordersCol = collection(db, 'orders');
            const q = query(ordersCol, where('vendorId', '==', restaurantId));
            const querySnapshot = await getDocs(q);
            const orders = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as unknown as Order[];
            return orders;
        } catch (error) {
            console.error("Error fetching restaurant orders:", error);
            return rejectWithValue('Failed to fetch orders.');
        }
    }
);

// Async thunk for fetching user orders (order tracking)
export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (userId: string, { dispatch, rejectWithValue }) => {
        try {
            const ordersQuery = query(
                collection(db, 'orders'),
                where('userId', '==', userId),
                where('trackingStatus', 'in', [1, 2, 3, 4, 5]), // Include all orders, including delivered
                orderBy('placedAt', 'desc')
            );

            // Set up real-time listener
            const unsubscribe = onSnapshot(
                ordersQuery,
                (snapshot) => {
                    const ordersList: Order[] = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        ordersList.push({
                            id: doc.id,
                            ...data,
                            placedAt: data.placedAt.toDate(),
                            estimatedDelivery: data.estimatedDelivery?.toDate() || new Date(Date.now() + 45 * 60 * 1000)
                        } as Order);
                    });
                    
                    // Dispatch action to update state with real-time data
                    dispatch(setUserOrders(ordersList));
                },
                (error) => {
                    console.error('Error in orders snapshot listener:', error);
                    dispatch(setError(error.message));
                }
            );

            // Store unsubscribe function for cleanup (stored on the thunk for later access)
            (fetchUserOrders as { unsubscribe?: () => void }).unsubscribe = unsubscribe;
            
            return []; // Initial return, real data comes from snapshot
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user orders');
        }
    }
);

// Async thunk to update the status of an order (vendor dashboard)
export const updateRestaurantOrderStatus = createAsyncThunk(
    'orders/updateRestaurantOrderStatus',
    async ({ restaurantId, orderId, status }: { restaurantId: string; orderId: string; status: Order['status'] }, { rejectWithValue }) => {
        try {
            const orderDocRef = doc(db, 'restaurants', restaurantId, 'orders', orderId);
            await updateDoc(orderDocRef, { status });
            return { orderId, status };
        } catch (error) {
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to update order status.');
        }
    }
);

// Async thunk for updating order tracking status (main orders collection)
export const updateOrderTrackingStatus = createAsyncThunk(
    'orders/updateOrderTrackingStatus',
    async ({ orderId, trackingStatus }: { orderId: string; trackingStatus: number }, { rejectWithValue }) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                trackingStatus,
                updatedAt: Timestamp.now()
            });
            return { orderId, trackingStatus };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to update order status');
        }
    }
);

// Async thunk to place a new order
export const placeOrder = createAsyncThunk(
    'orders/placeOrder',
    async ({ restaurantId, orderData }: { restaurantId: string; orderData: Omit<Order, 'id' | 'orderTime'> }, { rejectWithValue }) => {
        try {
            const ordersCol = collection(db, 'restaurants', restaurantId, 'orders');
            const orderPayload = {
                ...orderData,
                orderTime: serverTimestamp(),
                status: 'Pending' as const,
            };
            const docRef = await addDoc(ordersCol, orderPayload);
            return { ...orderPayload, id: docRef.id };
        } catch (error) {
            console.error("Error placing order:", error);
            if (error instanceof FirebaseError) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to place order.');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setSelectedOrder: (state, action: PayloadAction<string | null>) => {
            state.selectedOrderId = action.payload;
        },
        setUserOrders: (state, action: PayloadAction<Order[]>) => {
            state.userOrders = action.payload;
            state.lastUpdated = Date.now();
            
            // Auto-select the most recent order if none selected
            if (action.payload.length > 0 && !state.selectedOrderId) {
                state.selectedOrderId = action.payload[0].id;
            }
        },
        addUserOrder: (state, action: PayloadAction<Order>) => {
            const existingIndex = state.userOrders.findIndex(order => order.id === action.payload.id);
            if (existingIndex >= 0) {
                state.userOrders[existingIndex] = action.payload;
            } else {
                state.userOrders.unshift(action.payload); // Add to beginning (most recent)
            }
            state.lastUpdated = Date.now();
        },
        updateUserOrder: (state, action: PayloadAction<{ orderId: string; updates: Partial<Order> }>) => {
            const orderIndex = state.userOrders.findIndex(order => order.id === action.payload.orderId);
            if (orderIndex >= 0) {
                state.userOrders[orderIndex] = { ...state.userOrders[orderIndex], ...action.payload.updates };
                state.lastUpdated = Date.now();
            }
        },
        removeUserOrder: (state, action: PayloadAction<string>) => {
            state.userOrders = state.userOrders.filter(order => order.id !== action.payload);
            if (state.selectedOrderId === action.payload) {
                state.selectedOrderId = state.userOrders.length > 0 ? state.userOrders[0].id : null;
            }
            state.lastUpdated = Date.now();
        },
        clearUserOrders: (state) => {
            state.userOrders = [];
            state.selectedOrderId = null;
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
            // Restaurant orders (vendor dashboard)
            .addCase(fetchRestaurantOrders.pending, (state) => {
                state.restaurantOrdersStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchRestaurantOrders.fulfilled, (state, action) => {
                state.restaurantOrdersStatus = 'succeeded';
                state.restaurantOrders = action.payload;
            })
            .addCase(fetchRestaurantOrders.rejected, (state, action) => {
                state.restaurantOrdersStatus = 'failed';
                state.error = action.payload as string;
            })
            
            // User orders (tracking)
            .addCase(fetchUserOrders.pending, (state) => {
                state.userOrdersStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state) => {
                state.userOrdersStatus = 'succeeded';
                // Real data comes from setUserOrders action via snapshot listener
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.userOrdersStatus = 'failed';
                state.error = action.payload as string;
            })
            
            // Order status updates
            .addCase(updateRestaurantOrderStatus.fulfilled, (state, action) => {
                const { orderId, status } = action.payload;
                const orderIndex = state.restaurantOrders.findIndex(order => order.id === orderId);
                if (orderIndex >= 0) {
                    state.restaurantOrders[orderIndex].status = status;
                }
            })
            .addCase(updateOrderTrackingStatus.fulfilled, (state, action) => {
                const { orderId, trackingStatus } = action.payload;
                const orderIndex = state.userOrders.findIndex(order => order.id === orderId);
                if (orderIndex >= 0) {
                    state.userOrders[orderIndex].trackingStatus = trackingStatus as 1 | 2 | 3 | 4 | 5;
                    state.lastUpdated = Date.now();
                }
            })
            
            // Place order
            .addCase(placeOrder.pending, (state) => {
                state.restaurantOrdersStatus = 'loading';
                state.error = null;
            })
            .addCase(placeOrder.fulfilled, (state) => {
                state.restaurantOrdersStatus = 'succeeded';
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.restaurantOrdersStatus = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const {
    setSelectedOrder,
    setUserOrders,
    addUserOrder,
    updateUserOrder,
    removeUserOrder,
    clearUserOrders,
    setError,
    clearError
} = orderSlice.actions;

// Selectors for user orders (tracking)
export const selectUserOrders = (state: { orders: OrderState }) => state.orders.userOrders;
export const selectSelectedOrderId = (state: { orders: OrderState }) => state.orders.selectedOrderId;
export const selectSelectedOrder = (state: { orders: OrderState }) => {
    const selectedId = state.orders.selectedOrderId;
    return selectedId ? state.orders.userOrders.find(order => order.id === selectedId) || null : null;
};
export const selectUserOrdersStatus = (state: { orders: OrderState }) => state.orders.userOrdersStatus;
export const selectUserOrdersLoading = (state: { orders: OrderState }) => state.orders.userOrdersStatus === 'loading';

// Selectors for restaurant orders (vendor dashboard)
export const selectRestaurantOrders = (state: { orders: OrderState }) => state.orders.restaurantOrders;
export const selectRestaurantOrdersStatus = (state: { orders: OrderState }) => state.orders.restaurantOrdersStatus;
export const selectRestaurantOrdersLoading = (state: { orders: OrderState }) => state.orders.restaurantOrdersStatus === 'loading';

// Shared selectors
export const selectOrdersError = (state: { orders: OrderState }) => state.orders.error;
export const selectOrdersLastUpdated = (state: { orders: OrderState }) => state.orders.lastUpdated;

// Helper selectors
export const selectUserOrderById = (state: { orders: OrderState }, orderId: string) => 
    state.orders.userOrders.find(order => order.id === orderId);
export const selectPendingUserOrders = (state: { orders: OrderState }) => 
    state.orders.userOrders.filter(order => order.trackingStatus < 5);
export const selectActiveUserOrders = (state: { orders: OrderState }) => 
    state.orders.userOrders.filter(order => order.trackingStatus < 5 || (order.trackingStatus === 5 && !order.isRated));
export const selectUserOrdersByRestaurant = (state: { orders: OrderState }, restaurantId: string) => 
    state.orders.userOrders.filter(order => order.vendorId === restaurantId);

export default orderSlice.reducer;