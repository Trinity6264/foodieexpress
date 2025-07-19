'use client'; // This directive makes it a Client Component

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './index'; // Import makeStore and AppStore

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        // Create the store instance the first time this component renders
        storeRef.current = makeStore();
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}