'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface PageData {
  title: string;
  content: string;
  layout: 'default' | 'full-width' | 'sidebar';
  meta: {
    description?: string;
    keywords?: string;
  };
  is_published: boolean;
}

export default function Page({ slug }: { slug: string }) {
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/public/pages/${slug}`);
        
        if (response.data) {
          setPage(response.data);
          setError(null);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Failed to fetch page:', error);
        setError(error.response?.data?.message || 'Page not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{error || 'Page not found'}</p>
      </div>
    );
  }

  return (
    <div className={page.layout === 'full-width' ? 'w-full' : 'max-w-6xl mx-auto px-4'}>
      <div className="py-12">
        <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}