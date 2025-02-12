'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon?: string;
  order: number;
  is_active: boolean;
}

interface FeaturesSettings {
  is_active: boolean;
  section_title: string;
  section_description: string;
  layout: 'grid' | 'columns' | 'cards';
  items: FeatureItem[];
  settings?: any;
}

export default function Features() {
  const [settings, setSettings] = useState<FeaturesSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/public/features');
        if (response.data && response.data.is_active) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch features section');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  if (loading || !settings || !settings.is_active) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{settings.section_title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{settings.section_description}</p>
        </div>

        <div className={`
          grid gap-8
          ${settings.layout === 'grid' ? 'md:grid-cols-3' : 
            settings.layout === 'columns' ? 'grid-cols-1' : 
            'md:grid-cols-2'}
        `}>
          {settings.items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}