// src/components/ImageUploadInput.tsx
'use client';

import React, { useState, ChangeEvent } from 'react';
import { Plus, XCircle } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadInputProps {
    maxFiles?: number;
    onImagesSelected?: (files: File[]) => void;
    currentImages?: string[]; // Optional: for displaying existing image URLs if any
}

const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
    maxFiles = 3,
    onImagesSelected,
    currentImages = []
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>(currentImages);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFilesArray = Array.from(files);
        const totalFiles = selectedFiles.length + newFilesArray.length + currentImages.length;

        if (totalFiles > maxFiles) {
            alert(`You can select at most ${maxFiles} images.`);
            return;
        }

        setSelectedFiles(prev => [...prev, ...newFilesArray]);

        const newPreviewUrls = newFilesArray.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

        // Pass all selected files (new and previously selected) to the parent
        if (onImagesSelected) {
            onImagesSelected([...selectedFiles, ...newFilesArray]);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setPreviewUrls(prev => {
            const newUrls = prev.filter((_, index) => index !== indexToRemove);
            return newUrls;
        });

        // Filter out the corresponding file if it's one of the newly selected ones
        setSelectedFiles(prev => {
            let filesRemovedCount = 0;
            const newFiles = prev.filter((_, index) => {
                // Determine if this file corresponds to an index that was removed from previews
                // This logic assumes currentImages are always at the start of previewUrls
                if (indexToRemove >= currentImages.length && indexToRemove < currentImages.length + prev.length) {
                    if (index === (indexToRemove - currentImages.length - filesRemovedCount)) {
                        filesRemovedCount++; // Track how many new files have been removed
                        return false;
                    }
                }
                return true;
            });
            return newFiles;
        });

        // Revoke Object URLs to prevent memory leaks
        if (previewUrls[indexToRemove] && previewUrls[indexToRemove].startsWith('blob:')) {
            URL.revokeObjectURL(previewUrls[indexToRemove]);
        }

        // Inform parent component about the updated file list
        if (onImagesSelected) {
            // Reconstruct the new list of files (existing + new selected - removed ones)
            // This is a simplified approach; more robust handling might involve IDs or mapping
            // const remainingCurrentImages = currentImages.filter((_, index) => index < indexToRemove || index > indexToRemove);
            const updatedFilesForParent = selectedFiles.filter((_, index) => {
                // This is a simplified check. A more robust solution might pass an identifier from parent
                // to uniquely map files to their previews/indices.
                return (indexToRemove >= currentImages.length) ? (index !== (indexToRemove - currentImages.length)) : true;
            });
            onImagesSelected(updatedFilesForParent);
        }
    };


    const combinedImagesCount = previewUrls.length;
    const canAddMoreFiles = combinedImagesCount < maxFiles;

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                Images (at most {maxFiles})
            </label>
            <div className="mt-1 flex items-center space-x-3">
                {previewUrls.map((url, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-300">
                        <Image
                            src={url}
                            alt={`Preview ${index + 1}`}
                            width={96} // Explicitly set width to match w-24 (24*4=96px)
                            height={96} // Explicitly set height to match h-24 (24*4=96px)
                            className="w-full h-full object-cover"
                            unoptimized={url.startsWith('blob:')} // Bypass optimization for blob URLs
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-md hover:bg-gray-100 transition-colors"
                            aria-label={`Remove image ${index + 1}`}
                        >
                            <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                ))}
                {canAddMoreFiles && (
                    <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="text-center text-gray-500">
                            <Plus className="mx-auto w-6 h-6" />
                            <span className="text-xs mt-1 block">Add Image</span>
                        </div>
                    </div>
                )}
            </div>
            {combinedImagesCount === 0 && (
                <p className="text-sm text-gray-500">No images selected.</p>
            )}
            {combinedImagesCount >= maxFiles && (
                <p className="text-sm text-red-500">Maximum {maxFiles} images selected.</p>
            )}
        </div>
    );
};

export default ImageUploadInput;