import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { MenuItemInterface } from '@/interfaces/ItemInfoInterface';

export interface CartItem extends MenuItemInterface {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    // To ensure all items in the cart are from the same restaurant
    currentRestaurantId: string | null;
}

const initialState: CartState = {
    items: [],
    currentRestaurantId: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Action to add an item to the cart
        addItem: (state, action: PayloadAction<{ item: MenuItemInterface, restaurantId: string }>) => {
            const { item, restaurantId } = action.payload;

            // If the item is from a different restaurant, clear the cart first.
            if (state.currentRestaurantId && state.currentRestaurantId !== restaurantId) {
                state.items = [];
                state.currentRestaurantId = restaurantId;
            } else if (!state.currentRestaurantId) {
                state.currentRestaurantId = restaurantId;
            }

            const existingItem = state.items.find(i => i.id === item.id);

            if (existingItem) {
                // If item already exists, just increase the quantity
                existingItem.quantity += 1;
            } else {
                // Otherwise, add the new item with a quantity of 1
                state.items.push({ ...item, quantity: 1 });
            }
        },

        // Action to remove an item completely
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            // If the cart becomes empty, reset the restaurant ID
            if (state.items.length === 0) {
                state.currentRestaurantId = null;
            }
        },

        // Action to increase an item's quantity
        incrementQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i.id === action.payload);
            if (item) {
                item.quantity += 1;
            }
        },

        // Action to decrease an item's quantity
        decrementQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // If quantity is 1, remove the item
                state.items = state.items.filter(i => i.id !== action.payload);
                if (state.items.length === 0) {
                    state.currentRestaurantId = null;
                }
            }
        },

        // Action to clear the entire cart
        clearCart: (state) => {
            state.items = [];
            state.currentRestaurantId = null;
        },
    },
});

export const {
    addItem,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    clearCart,
} = cartSlice.actions;

// Selectors to get data from the state
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartItemCount = (state: RootState) => state.cart.items.reduce((count, item) => count + item.quantity, 0);


export default cartSlice.reducer;