import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db, storage } from "@/firebase/init";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { MenuItemInterface } from "@/interfaces/ItemInfoInterface";

interface MenuState {
    items: MenuItemInterface[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: MenuState = {
    items: [],
    status: 'idle',
    error: null,
};

// Async thunk to fetch menu items
export const fetchMenuItems = createAsyncThunk(
    'menu/fetchMenuItems',
    async (restaurantId: string, { rejectWithValue }) => {
        try {
            const menuCol = collection(db, 'restaurants', restaurantId, 'menuItems');
            const querySnapshot = await getDocs(menuCol);

            // --- Start of Fix ---
            // Create a properly typed array. The 'as unknown as' cast is the standard way
            // to tell TypeScript you are certain about the shape of the incoming data.
            const menuItems = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as unknown as MenuItemInterface[];
            // --- End of Fix ---

            return menuItems;
        } catch (error) {
            console.error("Error fetching menu items:", error);
            return rejectWithValue('Failed to fetch menu items.');
        }
    }
);

// Add thunk is fine, but we'll ensure consistency
export const addMenuItem = createAsyncThunk(
    'menu/addMenuItem',
    async ({ restaurantId, itemData, imageFile }: { restaurantId: string; itemData: Omit<MenuItemInterface, 'id' | 'image'>; imageFile: File }, { rejectWithValue }) => {
        try {
            const imageRef = ref(storage, `menuItems/${restaurantId}/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            const imageUrl = await getDownloadURL(snapshot.ref);

            const newItemDoc = { ...itemData, image: imageUrl };
            const menuCol = collection(db, 'restaurants', restaurantId, 'menuItems');
            const docRef = await addDoc(menuCol, newItemDoc);

            return { ...newItemDoc, id: docRef.id } as MenuItemInterface;
        } catch (error) {
            console.error(error);
            return rejectWithValue('Failed to add menu item.');
        }
    }
);

// Update thunk is fine
export const updateMenuItem = createAsyncThunk(
    'menu/updateMenuItem',
    async ({ restaurantId, item, newImageFile }: { restaurantId: string; item: MenuItemInterface; newImageFile: File | null }, { rejectWithValue }) => {
        try {
            let imageUrl = item.image;
            if (newImageFile) {
                const imageRef = ref(storage, `menuItems/${restaurantId}/${Date.now()}_${newImageFile.name}`);
                const snapshot = await uploadBytes(imageRef, newImageFile);
                imageUrl = await getDownloadURL(snapshot.ref);

                if (item.image) {
                    try {
                        const oldImageRef = ref(storage, item.image);
                        await deleteObject(oldImageRef);
                    } catch (e) {
                        console.error("Old image deletion failed:", e);
                    }
                }
            }

            const { id, ...itemData } = item; // Exclude id from data being updated
            const updatedItemData = { ...itemData, image: imageUrl };
            const itemDocRef = doc(db, 'restaurants', restaurantId, 'menuItems', id);
            await updateDoc(itemDocRef, updatedItemData);

            return { ...updatedItemData, id }; // Return the full item with id
        } catch (error) {
            console.error("Error updating menu item:", error);
            return rejectWithValue('Failed to update menu item.');
        }
    }
);


// Async thunk to delete a menu item - Updated to use string ID
export const deleteMenuItem = createAsyncThunk(
    'menu/deleteMenuItem',
    // --- Start of Fix ---
    async ({ restaurantId, itemId, imageUrl }: { restaurantId: string; itemId: string; imageUrl: string }, { rejectWithValue }) => {
        // --- End of Fix ---
        try {
            // Delete the document from Firestore
            const itemDocRef = doc(db, 'restaurants', restaurantId, 'menuItems', itemId);
            await deleteDoc(itemDocRef);

            // Delete the image from Storage
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);

            return itemId; // Return the string ID of the deleted item
        } catch (error) {
            console.error("Error deleting menu item:", error);
            return rejectWithValue('Failed to delete menu item.');
        }
    }
);

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchMenuItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMenuItems.fulfilled, (state, action: PayloadAction<MenuItemInterface[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchMenuItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Add
            .addCase(addMenuItem.fulfilled, (state, action: PayloadAction<MenuItemInterface>) => {
                state.items.push(action.payload);
            })
            // Update
            .addCase(updateMenuItem.fulfilled, (state, action: PayloadAction<MenuItemInterface>) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            // --- Start of Fix ---
            .addCase(deleteMenuItem.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
        // --- End of Fix ---
    }
});

export default menuSlice.reducer;