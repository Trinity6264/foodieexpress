// src/store/features/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth } from '@/firebase/init'; //
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
            return JSON.parse(JSON.stringify(userCredential.user));
        } catch (error: unknown) {
            // --- Start of Changes ---
            let errorMessage = "An unknown error occurred.";
            if (typeof error === 'object' && error !== null && 'code' in error) {
                const errorCode = (error as { code: string }).code;
                switch (errorCode) {
                    case 'auth/invalid-credential':
                        errorMessage = "Invalid email or password. Please try again.";
                        break;
                    case 'auth/user-not-found':
                        errorMessage = "No account found with this email address.";
                        break;
                    case 'auth/wrong-password':
                        errorMessage = "Incorrect password. Please try again.";
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.";
                        break;
                    default:
                        errorMessage = "Failed to login. Please try again later.";
                        break;
                }
            }
            return rejectWithValue(errorMessage);
            // --- End of Changes ---
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
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