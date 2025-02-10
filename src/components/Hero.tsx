'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface HeroSettings {
  is_active: boolean;
  title: string;
  subtitle: string;
  background_type: 'color' | 'image';
  background_color?: string;
  background_image?: string;
  cta_text?: string;
  cta_link?: string;
  alignment: 'left' | 'center' | 'right';
}

export default function Hero() {
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/public/hero');
        if (response.data && response.data.is_active) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch hero section');
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  if (loading || !settings || !settings.is_active) return null;

  return (
    <div
      className={`w-full`}
      style={{
        backgroundColor: settings.background_type === 'color' ? settings.background_color : undefined,
        backgroundImage: settings.background_type === 'image' ? `url(${settings.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className={`text-${settings.alignment}`}>
          <h1 className="text-5xl font-bold mb-6">{settings.title}</h1>
          <p className="text-xl mb-8">{settings.subtitle}</p>
          {settings.cta_text && (
            <a
              href={settings.cta_link || '#'}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {settings.cta_text}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}