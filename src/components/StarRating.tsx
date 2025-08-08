import React from 'react';

interface StarRatingProps {
    rating: number;
    totalRatings?: number;
    showRatingText?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    totalRatings,
    showRatingText = true,
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    const renderStar = (index: number) => {
        const isFilled = index < Math.floor(rating);
        const isHalfFilled = index === Math.floor(rating) && rating % 1 >= 0.5;

        return (
            <div key={index} className="relative">
                {/* Background star (empty) */}
                <svg
                    className={`${sizeClasses[size]} text-gray-300`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                
                {/* Filled star */}
                {(isFilled || isHalfFilled) && (
                    <svg
                        className={`${sizeClasses[size]} text-yellow-400 absolute top-0 left-0`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        style={isHalfFilled ? { clipPath: 'inset(0 50% 0 0)' } : {}}
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                )}
            </div>
        );
    };

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <div className="flex items-center">
                {[...Array(5)].map((_, index) => renderStar(index))}
            </div>
            
            {showRatingText && (
                <div className={`flex items-center gap-1 ${textSizeClasses[size]} text-gray-600`}>
                    <span className="font-medium">
                        {rating > 0 ? rating.toFixed(1) : 'No ratings'}
                    </span>
                    {totalRatings !== undefined && totalRatings > 0 && (
                        <span className="text-gray-500">
                            ({totalRatings} review{totalRatings !== 1 ? 's' : ''})
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default StarRating;
