'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('@/components/editor/TipTapEditor'), { ssr: false });

interface PageData {
  title: string;
  content: string;
  layout: 'default' | 'full-width' | 'sidebar';
  is_published: boolean;
  meta: {
    description?: string;
    keywords?: string;
  };
}

function PageForm({ action }: { action: string }) {
  const router = useRouter();
  const isEdit = action !== 'create';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<PageData>({
    title: '',
    content: '',
    layout: 'default',
    is_published: false,
    meta: {}
  });

  useEffect(() => {
    if (isEdit) {
      fetchPage();
    } else {
      setLoading(false);
    }
  }, [isEdit]);

  const fetchPage = async () => {
    try {
      const response = await api.get(`/pages/${action}`);
      setPageData(response.data);
    } catch (error) {
      toast.error('Failed to fetch page');
      router.push('/dashboard/pages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEdit) {
        await api.put(`/pages/${action}`, pageData);
      } else {
        await api.post('/pages', pageData);
      }
      
      toast.success(`Page ${isEdit ? 'updated' : 'created'} successfully`);
      router.push('/dashboard/pages');
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} page`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit' : 'Create'} Page</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Page Title</label>
              <input
                type="text"
                value={pageData.title}
                onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Layout</label>
              <select
                value={pageData.layout}
                onChange={(e) => setPageData({ ...pageData, layout: e.target.value as PageData['layout'] })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="default">Default</option>
                <option value="full-width">Full Width</option>
                <option value="sidebar">With Sidebar</option>
              </select>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={pageData.is_published}
                  onChange={(e) => setPageData({ ...pageData, is_published: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">Publish this page</span>
              </label>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Content</h2>
          <Editor
            content={pageData.content}
            onChange={(content) => setPageData({ ...pageData, content })}
          />
        </div>

        {/* SEO Settings */}
        <div>
          <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Meta Description</label>
              <textarea
                value={pageData.meta.description || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  meta: { ...pageData.meta, description: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Keywords</label>
              <input
                type="text"
                value={pageData.meta.keywords || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  meta: { ...pageData.meta, keywords: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Separate keywords with commas"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/pages')}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
          >
            {saving ? 'Saving...' : (isEdit ? 'Update Page' : 'Create Page')}
          </button>
        </div>
      </form>
    </div>
  );
}

// Komponen utama yang menggunakan use()
export default function PageFormWrapper({ params }: { params: Promise<{ action: string }> }) {
  const resolvedParams = use(params);
  return <PageForm action={resolvedParams.action} />;
}