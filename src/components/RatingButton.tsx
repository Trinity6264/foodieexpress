import React from 'react';
import { Star } from 'lucide-react';

interface RatingButtonProps {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

const RatingButton: React.FC<RatingButtonProps> = ({ 
    onClick, 
    disabled = false, 
    className = '' 
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                flex items-center gap-2 px-4 py-2 
                bg-orange-500 hover:bg-orange-600 
                disabled:bg-gray-300 disabled:cursor-not-allowed
                text-white text-sm font-medium 
                rounded-md transition-colors duration-200
                ${className}
            `}
        >
            <Star className="w-4 h-4" />
            Rate Order
        </button>
    );
};

export default RatingButton;
