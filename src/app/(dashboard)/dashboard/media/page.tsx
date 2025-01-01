'use client';

import { useState, useEffect } from 'react';
import { UploadButton } from '@/components/media/UploadButton';
import { FileIcon, ImageIcon, VideoIcon, Trash2, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface MediaItem {
  id: number;
  name: string;
  file_path: string;
  url: string;
  type: 'image' | 'video';
  mime_type: string;
  size: number;
  collection_name?: string;
  created_at: string;
}

interface PaginatedResponse {
  data: MediaItem[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    // ... meta lainnya jika diperlukan
  };
}

interface FileUploadResult {
  url: string;
  name: string;
  size: number;
  type: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      const response = await api.get<PaginatedResponse>('/media');
      setMedia(response.data.data);
    } catch (error) {
      console.error('Fetch media error:', error);
      toast.error('Failed to fetch media');
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = async (files: FileUploadResult[]) => {
    try {
      for (const file of files) {
        const payload = {
          name: file.name,
          file_path: file.url,
          mime_type: file.type,
          size: file.size,
          uploadthing_url: file.url,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          filename: file.name
        };
        
        console.log('Sending media data:', payload);
        
        await api.post('/media', payload);
      }
      
      await fetchMedia();
      toast.success('Media saved successfully');
    } catch (error: any) {
      console.error('Save media error:', {
        message: error.response?.data?.message,
        errors: error.response?.data?.errors,
        data: error.response?.data
      });
      toast.error(error.response?.data?.message || 'Failed to save media');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      await api.delete(`/media/${id}`);
      toast.success('Media deleted successfully');
      fetchMedia(); // Refresh list
    } catch (error) {
      toast.error('Failed to delete media');
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <UploadButton onUploadComplete={handleUploadComplete} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {media.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow">
            {item.type === 'image' ? (
              <img src={item.url} alt={item.filename} className="w-full h-40 object-cover rounded" />
            ) : (
              <video src={item.url} className="w-full h-40 object-cover rounded" controls />
            )}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center">
                {item.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
                <span className="ml-2 text-sm truncate">{item.filename}</span>
              </div>
              <button 
                onClick={() => handleDelete(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}