import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice'; 
import menuReducer from './features/menuSlice';
import orderReducer from './features/orderSlice';
import cartReducer from './features/cartSlice';
import transactionReducer from './features/transactionSlice';



export const makeStore = () => {
    return configureStore({
        reducer: {
            // Add your slices here
            auth: authReducer,
            menu: menuReducer,
            orders: orderReducer, 
            cart: cartReducer,
            transactions: transactionReducer,
        },
        // Add any middleware here if needed
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];