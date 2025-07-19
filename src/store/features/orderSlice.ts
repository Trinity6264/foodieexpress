import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "@/firebase/init";
import { collection, getDocs, updateDoc, doc, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { Order } from "@/interfaces/OrderInterface";
import { FirebaseError } from "firebase/app";

interface OrderState {
    orders: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    status: 'idle',
    error: null,
};

// Async thunk to fetch all orders for a restaurant
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (restaurantId: string, { rejectWithValue }) => {
        try {
            const ordersCol = collection(db, 'restaurants', restaurantId, 'orders');
            const q = query(ordersCol, orderBy('orderTime', 'desc'));
            const querySnapshot = await getDocs(q);
            const orders = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as unknown as Order[];
            return orders;
        } catch (error) {
            console.error("Error fetching orders:", error);
            return rejectWithValue('Failed to fetch orders.');
        }
    }
);

// Async thunk to update the status of an order
export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
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

// NEW: Async thunk to place a new order
export const placeOrder = createAsyncThunk(
    'orders/placeOrder',
    async ({ restaurantId, orderData }: { restaurantId: string; orderData: Omit<Order, 'id' | 'orderTime'> }, { rejectWithValue }) => {
        try {
            const ordersCol = collection(db, 'restaurants', restaurantId, 'orders');
            const orderPayload = {
                ...orderData,
                orderTime: serverTimestamp(), // Use server timestamp for accuracy
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
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ... (existing extraReducers) ...

            // Add cases for the new placeOrder thunk
            .addCase(placeOrder.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(placeOrder.fulfilled, (state) => {
                state.status = 'succeeded';
                // Optionally add the new order to the state
                // state.orders.unshift(action.payload as Order); 
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export default orderSlice.reducer;