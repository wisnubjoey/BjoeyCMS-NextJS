'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import TipTapEditor from '@/components/editor/TipTapEditor';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  // tambahkan field lain jika diperlukan
}

// Komponen untuk form dan logic
function EditPostForm({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft'
  });

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        const postData = response.data.data || response.data;
        
        setPost(postData);
        setFormData({
          title: postData.title || '',
          content: postData.content || '',
          status: postData.status || 'draft'
        });
      } catch (err: any) {
        console.error('Error fetching post:', err);
        toast.error(err.response?.data?.message || 'Failed to fetch post');
        router.push('/dashboard/post');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put(`/posts/${id}`, {
        ...formData,
        content: formData.content || ''  // Pastikan content tidak undefined
      });
      
      if (response.data) {
        toast.success('Post updated successfully');
        router.push('/dashboard/post');
      }
    } catch (err: any) {
      console.error('Error updating post:', err);
      toast.error(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Post</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            {!initialLoading && (
              <TipTapEditor 
                content={formData.content} 
                onChange={(newContent) => handleChange('content', newContent)}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Komponen utama yang menggunakan use()
export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <EditPostForm id={resolvedParams.id} />;
}