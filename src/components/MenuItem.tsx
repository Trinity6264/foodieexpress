import { MenuItemInterface } from "@/interfaces/ItemInfoInterface"
import { Plus } from "lucide-react"
import Image from "next/image"

interface ItemInfoInterfaceProp {
    item: MenuItemInterface
}


const MenuItem = ({ item }: ItemInfoInterfaceProp) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
                <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                />
                {item.popular && (
                    <div className="absolute top-3 left-3 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Popular
                    </div>
                )}
                <button
                    onClick={() => { }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                    {/* <Heart
                      className={`w-4 h-4 ${favorites.includes(item.id)
                          ? 'text-red-500 fill-current'
                          : 'text-gray-400'
                          }`}
                  /> */}
                </button>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                    {item.spicy && (
                        <span className="text-red-500 text-sm">🌶️</span>
                    )}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900">
                        ₵{item.price.toFixed(2)}
                    </div>
                    <button
                        onClick={() => { }}
                        className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MenuItem
