import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/firebase/init";
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
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

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Orders
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Update Order Status
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const { orderId, status } = action.payload;
                const existingOrder = state.orders.find(order => order.id === orderId);
                if (existingOrder) {
                    existingOrder.status = status;
                }
            });
    }
});

export default orderSlice.reducer;