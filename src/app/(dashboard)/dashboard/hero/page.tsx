// src/app/(dashboard)/dashboard/hero/page.tsx
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import MediaPicker from '@/components/media/MediaPicker';

interface HeroSettings {
  id?: number;
  is_active: boolean;
  is_generated: boolean;
  title: string;
  subtitle: string;
  background_type: 'color' | 'image';
  background_color?: string;
  background_image?: string;
  cta_text?: string;
  cta_link?: string;
  alignment: 'left' | 'center' | 'right';
  settings?: any;
}

export default function HeroPage() {
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [formSettings, setFormSettings] = useState<HeroSettings | null>(null);
  const [saving, setSaving] = useState(false);

  // Check if hero section exists
  const checkHero = async () => {
    try {
      const response = await api.get('/hero/check');
      if (!response.data.is_generated) {
        setShowGenerateModal(true);
      } else {
        const heroData = response.data.settings || response.data;
        setSettings(heroData);
        setFormSettings(heroData);
      }
    } catch (error) {
      console.error('Error checking hero:', error);
      toast.error('Failed to check hero status');
    } finally {
      setLoading(false);
    }
  };

  // Generate hero section
  const handleGenerate = async () => {
    try {
      const response = await api.post('/hero/generate');
      setSettings(response.data);
      setFormSettings(response.data);
      setShowGenerateModal(false);
      toast.success('Hero section generated successfully');
    } catch (error) {
      console.error('Error generating hero:', error);
      toast.error('Failed to generate hero section');
    }
  };

  // Toggle hero active state
  const handleToggleActive = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await api.post('/hero/toggle');
      setSettings(response.data);
      setFormSettings(response.data);
      toast.success(response.data.is_active ? 'Hero section activated' : 'Hero section deactivated');
    } catch (error) {
      console.error('Error toggling hero:', error);
      toast.error('Failed to toggle hero section');
    } finally {
      setSaving(false);
    }
  };

  // Update hero settings
  const handleUpdate = async () => {
    if (!formSettings) return;

    try {
      setSaving(true);
      const response = await api.put('/hero/update', formSettings);
      setSettings(response.data);
      setFormSettings(response.data);
      toast.success('Hero section updated successfully');
    } catch (error: any) {
      console.error('Error updating hero:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update hero section');
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle form changes
  const handleFormChange = (changes: Partial<HeroSettings>) => {
    if (!formSettings) return;
    setFormSettings({ ...formSettings, ...changes });
  };

  // Handle background image update
  const handleBackgroundImageUpdate = (url: string) => {
    handleFormChange({ background_image: url });
  };

  // Handle background image removal
  const handleBackgroundImageRemove = () => {
    handleFormChange({ background_image: null });
  };

  useEffect(() => {
    checkHero();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Generate Hero Section</h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t created a hero section yet. Would you like to generate one now?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Generate Hero
              </button>
            </div>
          </div>
        </div>
      )}

      {settings && formSettings && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Hero Section</h1>
            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleToggleActive}
                disabled={saving}
                className={`px-4 py-2 rounded-lg ${
                  settings.is_active 
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } disabled:opacity-50`}
              >
                {saving ? 'Saving...' : settings.is_active ? 'Deactivate Hero' : 'Activate Hero'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            {/* Content Settings */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Content</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={formSettings.title}
                    onChange={(e) => handleFormChange({ title: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                  <input
                    type="text"
                    value={formSettings.subtitle}
                    onChange={(e) => handleFormChange({ subtitle: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CTA Text</label>
                  <input
                    type="text"
                    value={formSettings.cta_text || ''}
                    onChange={(e) => handleFormChange({ cta_text: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Enter call-to-action text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CTA Link</label>
                  <input
                    type="text"
                    value={formSettings.cta_link || ''}
                    onChange={(e) => handleFormChange({ cta_link: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Enter call-to-action link"
                  />
                </div>
              </div>
            </div>

            {/* Style Settings */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Style</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Background Type</label>
                  <select
                    value={formSettings.background_type}
                    onChange={(e) => handleFormChange({ background_type: e.target.value as 'color' | 'image' })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="color">Color</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                
                {formSettings.background_type === 'color' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Background Color</label>
                    <input
                      type="color"
                      value={formSettings.background_color || '#ffffff'}
                      onChange={(e) => handleFormChange({ background_color: e.target.value })}
                      className="mt-1 block"
                    />
                  </div>
                )}

                {formSettings.background_type === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Background Image</label>
                    <MediaPicker
                      value={formSettings.background_image || ''}
                      onChange={handleBackgroundImageUpdate}
                      onRemove={handleBackgroundImageRemove}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Content Alignment</label>
                  <select
                    value={formSettings.alignment}
                    onChange={(e) => handleFormChange({ alignment: e.target.value as 'left' | 'center' | 'right' })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <div className="border rounded-lg overflow-hidden">
                <div
                  className={`p-12`}
                  style={{
                    backgroundColor: formSettings.background_type === 'color' ? formSettings.background_color : undefined,
                    backgroundImage: formSettings.background_type === 'image' ? `url(${formSettings.background_image})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className={`max-w-4xl mx-auto text-${formSettings.alignment}`}>
                    <h1 className="text-4xl font-bold mb-4">{formSettings.title || 'Your Title Here'}</h1>
                    <p className="text-xl mb-8">{formSettings.subtitle || 'Your subtitle here'}</p>
                    {formSettings.cta_text && (
                      <a
                        href={formSettings.cta_link || '#'}
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                      >
                        {formSettings.cta_text}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}