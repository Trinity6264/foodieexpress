'use client'; // <--- Add this line at the very top

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import CartPageContent with SSR disabled
const CartPageContent = dynamic(
  () => import('./CartPageContent'),
  { ssr: false } // This ensures the component is only rendered on the client side
);

const CartPage = () => {
  return <CartPageContent />;
};

export default CartPage;