    // src/components/Navbar.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface NavbarSettings {
  logo_url: string | null;
  site_name: string;
  is_active: boolean;
}

export default function Navbar() {
  const [settings, setSettings] = useState<NavbarSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/public/navbar');
        if (response.data && response.data.is_active) {
          setSettings(response.data);
        } else {
          setSettings(null);
        }
      } catch (error) {
        console.error('Failed to fetch navbar');
        setSettings(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNavbar();
  }, []);

  if (loading || !settings || !settings.is_active) return null;

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            {settings.logo_url && (
              <Image 
                src={settings.logo_url}
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
            )}
            <span className="font-medium text-gray-900">{settings.site_name}</span>
          </div>
          {/* Sample menu items */}
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Home</span>
            <span className="text-gray-500">About</span>
            <span className="text-gray-500">Contact</span>
          </div>
        </div>
      </div>
    </nav>
  );
}