'use client';

import { useState } from 'react';
import { UploadButton as UTButton } from '@uploadthing/react';
import { toast } from 'react-hot-toast';
import { FileIcon, ImageIcon } from 'lucide-react';

interface UploadButtonProps {
  onUploadComplete: (files: Array<{
    url: string;
    name: string;
    size: number;
    type: string;
  }>) => void;
}

export function UploadButton({ onUploadComplete }: UploadButtonProps) {
  return (
    <UTButton
      endpoint="mediaUploader"
      onClientUploadComplete={(res) => {
        if (!res) return;
        const urls = res.map((file) => ({
          url: file.url,
          name: file.name,
          size: file.size,
          type: file.type
        }));
        onUploadComplete(urls);
      }}
      onUploadError={(error: Error) => {
        console.error('Upload error:', error);
        toast.error(`Upload failed: ${error.message}`);
      }}
    />
  );
}