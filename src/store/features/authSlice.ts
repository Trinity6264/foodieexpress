import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth, db } from '@/firebase/init';
import { signInWithEmailAndPassword, User, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { RestaurantInfoInterface } from '@/interfaces/RestaurantInfoInterface';

type SerializableUser = Omit<User, 'providerData'>;

interface AuthState {
    user: SerializableUser | null;
    isLoading: boolean;
    error: string | null;
    restaurantInfo: RestaurantInfoInterface | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
    restaurantInfo: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const restaurantDocRef = doc(db, 'restaurants', user.uid);
            const restaurantDocSnap = await getDoc(restaurantDocRef);

            const serializableUser: SerializableUser = JSON.parse(JSON.stringify(user));
            const restaurantData = restaurantDocSnap.exists()
                ? (restaurantDocSnap.data() as RestaurantInfoInterface)
                : null;

            return { user: serializableUser, restaurantInfo: restaurantData };

        } catch (error: unknown) {
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
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            firebaseSignOut(auth);
            state.user = null;
            state.restaurantInfo = null;
        },
        setRestaurantInfo: (state, action: PayloadAction<RestaurantInfoInterface>) => {
            state.restaurantInfo = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.restaurantInfo = action.payload.restaurantInfo;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, setRestaurantInfo } = authSlice.actions;
export default authSlice.reducer;