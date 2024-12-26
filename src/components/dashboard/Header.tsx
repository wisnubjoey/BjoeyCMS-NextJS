'use client';

import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Pastikan token ada di header request
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Kirim request logout ke API
      await api.post('/logout');
      
      // Hapus token dari localStorage
      localStorage.removeItem('token');
      
      // Hapus token dari cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      toast.success('Logged out successfully');
      router.push('/login');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Jika dapat error 401 atau tidak ada token, force logout
      if (error.response?.status === 401 || error.message === 'No token found') {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        router.push('/login');
        return;
      }
      
      toast.error('Failed to logout properly');
    }
  };

  return (
    <header className="bg-white border-b h-16 flex items-center px-6 justify-between">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <Button
        onClick={handleLogout}
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </header>
  );
}