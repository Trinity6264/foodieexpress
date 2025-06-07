import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice'; // Import the new reducer
export const makeStore = () => {
    return configureStore({
        reducer: {
            // Add your slices here
            auth: authReducer,
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