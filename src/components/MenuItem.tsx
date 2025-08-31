'use client'; // This must be a client component to use hooks

import { MenuItemInterface } from "@/interfaces/ItemInfoInterface"
import { Plus } from "lucide-react"
import Image from "next/image"
import { useAppDispatch } from "@/store/hooks";
import { addItem, clearCart } from "@/store/features/cartSlice";
import { useRouter } from "next/navigation";

interface ItemInfoInterfaceProp {
    item: MenuItemInterface;
    restaurantId: string; // We need to know which restaurant this item belongs to
}

const MenuItem = ({ item, restaurantId }: ItemInfoInterfaceProp) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleAddToCart = () => {
        // Dispatch the addItem action with the item and its restaurant's ID
        dispatch(addItem({ item, restaurantId }));
    };

    const handleBuyNow = () => {
        // Clear the cart and add only this item, then navigate to cart page to confirm order
        dispatch(clearCart());
        dispatch(addItem({ item, restaurantId }));
        router.push('/cart');
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
                <Image src={item.image} alt={item.name} width={300} height={200} className="w-full h-48 object-cover" />
                {item.popular && <div className="absolute top-3 left-3 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">Popular</div>}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                    {item.spicy && <span className="text-red-500 text-sm">🌶️</span>}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900">₵{item.price.toFixed(2)}</div>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleAddToCart} className="flex cursor-pointer items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                            <Plus className="w-4 h-4" />
                            <span>Add</span>
                        </button>
                        <button onClick={handleBuyNow} className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MenuItem;