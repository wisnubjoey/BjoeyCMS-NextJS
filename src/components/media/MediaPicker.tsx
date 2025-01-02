'use client';

import { useState } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { UploadButton } from '@/components/media/UploadButton';
import Image from 'next/image';

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export default function MediaPicker({ value, onChange, onRemove }: MediaPickerProps) {
  return (
    <div className="border-2 border-dashed rounded-lg p-4">
      {value ? (
        <div className="relative">
          <Image
            src={value}
            alt="Logo"
            width={200}
            height={100}
            className="object-contain"
          />
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <UploadButton 
              onUploadComplete={(urls) => {
                if (urls && urls.length > 0) {
                  onChange(urls[0]);
                }
              }}
            />
          </div>
          <p className="text-xs leading-5 text-gray-600">PNG, JPG, SVG up to 10MB</p>
        </div>
      )}
    </div>
  );
}