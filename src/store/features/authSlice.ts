// src/store/features/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth } from '@/firebase/init';
import { signInWithEmailAndPassword, User } from 'firebase/auth';

// Define a type for the slice state
interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

// Define the initial state using that type
const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
};

// Create an async thunk for logging in a user
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // The user object contains all the user data
            // You may want to serialize it before putting it in the store
            return JSON.parse(JSON.stringify(userCredential.user));
        } catch (error: unknown) {
            // Use rejectWithValue to return a custom error payload
            let message = 'An unknown error occurred';
            if (error instanceof Error) {
                message = error.message;
            }
            return rejectWithValue(message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Standard reducers can go here if needed
        logout: (state) => {
            state.user = null;
            auth.signOut();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;