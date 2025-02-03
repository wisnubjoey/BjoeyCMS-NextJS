    // src/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface MenuItem {
  id: number;
  title: string;
  link: string;
  type: 'custom' | 'page';
  order: number;
}

interface NavbarSettings {
  id: number;
  is_active: boolean;
  logo_url: string | null;
  site_name: string;
  settings: {
    style: {
      backgroundColor: string;
      textColor: string;
      padding: 'small' | 'medium' | 'large';
      width: 'full' | 'contained';
      menuAlignment: 'start' | 'center' | 'end';
    };
  };
}

export default function Navbar() {
  const [settings, setSettings] = useState<NavbarSettings | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/public/navbar');
        if (response.data && response.data.is_active) {
          setSettings(response.data);
          // Fetch menu items
          const menuResponse = await axios.get(`http://localhost:8000/api/public/navbar/${response.data.id}/menu-items`);
          setMenuItems(menuResponse.data);
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

  const { style } = settings.settings;

  // Background color classes
  const bgColorClasses = {
    dark: 'bg-gray-800',
    gray: 'bg-gray-100',
    white: 'bg-white'
  };

  // Padding classes
  const paddingClasses = {
    small: 'px-2 py-2',
    medium: 'px-4 py-4',
    large: 'px-8 py-6'
  };

  // Text color classes
  const textColorClasses = {
    light: 'text-white',
    dark: 'text-gray-900'
  };

  return (
    <nav className={`
      ${bgColorClasses[style.backgroundColor as keyof typeof bgColorClasses] || bgColorClasses.white}
      shadow
    `}>
      <div className={`
        ${style.width === 'contained' ? 'max-w-6xl mx-auto' : 'w-full'}
        ${paddingClasses[style.padding]}
      `}>
        <div className={`
          flex items-center
          ${style.menuAlignment === 'center' ? 'justify-center gap-8' : 
            style.menuAlignment === 'start' ? 'justify-start gap-8' : 
            'justify-between'}
        `}>
          <div className="flex items-center gap-4 shrink-0">
            {settings.logo_url && (
              <Image 
                src={settings.logo_url}
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
            )}
            <span className={`font-medium ${
              textColorClasses[style.textColor as keyof typeof textColorClasses]
            }`}>
              {settings.site_name}
            </span>
          </div>
          
          <div className={`flex gap-4 text-sm ${
            style.menuAlignment === 'center' ? 'flex-1 justify-center' : ''
          }`}>
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className={`${
                  style.textColor === 'light' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                } transition-colors`}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}