import { configureStore } from '@reduxjs/toolkit';
// Import your reducers here later, e.g., import restaurantReducer from './features/restaurantSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            // Add your slices here
            // restaurant: restaurantReducer,
        },
        // Add any middleware here if needed
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];