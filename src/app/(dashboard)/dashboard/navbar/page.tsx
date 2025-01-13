'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import MediaPicker from '@/components/media/MediaPicker';

// Types
interface NavbarSettings {
  is_active: boolean;
  is_generated: boolean;
  logo_url: string | null;
  site_name: string;
  settings: any;
}

export default function NavbarPage() {
    const [loading, setLoading] = useState(true);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [settings, setSettings] = useState<NavbarSettings | null>(null);
    const [saving, setSaving] = useState(false);
    const [siteName, setSiteName] = useState('');

    const handleToggleActive = async () => {
      try {
        const response = await api.post('/navbar/toggle');
        setSettings(response.data);
        toast.success(response.data.is_active ? 'Navbar activated' : 'Navbar deactivated');
      } catch (error) {
        toast.error('Failed to toggle navbar');
      }
    };
  

  // Check if navbar is generated
  const checkNavbar = async () => {
    try {
      const response = await api.get('/navbar/check');
      if (!response.data.is_generated) {
        setShowGenerateModal(true);
      } else {
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to check navbar status');
    } finally {
      setLoading(false);
    }
};

  // Generate navbar
  const handleGenerate = async () => {
    try {
      const response = await api.post('/navbar/generate');
      setSettings(response.data);
      setShowGenerateModal(false);
      toast.success('Navbar generated successfully');
    } catch (error) {
      toast.error('Failed to generate navbar');
    }
  };

  const handleLogoChange = async (url: string) => {
    try {
      setSaving(true);
      const response = await api.put('/navbar/update', {
        ...settings,
        logo_url: url
      });
      setSettings(response.data);
      toast.success('Logo updated successfully');
    } catch (error) {
      toast.error('Failed to update logo');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoRemove = async () => {
    try {
      setSaving(true);
      const response = await api.put('/navbar/update', {
        ...settings,
        logo_url: null
      });
      setSettings(response.data);
      toast.success('Logo removed successfully');
    } catch (error) {
      toast.error('Failed to remove logo');
    } finally {
      setSaving(false);
    }
  };

  const handleSiteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSiteName(e.target.value);
  };

  const handleUpdateSiteName = async () => {
    try {
      setSaving(true);
      const response = await api.put('/navbar/update', {
        ...settings,
        site_name: siteName
      });
      setSettings(response.data);
      toast.success('Site name updated');
    } catch (error) {
      toast.error('Failed to update site name');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    checkNavbar();
  }, []);

  useEffect(() => {
    if (settings?.site_name) {
      setSiteName(settings.site_name);
    }
  }, [settings?.site_name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Navbar Management</h1>
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Generate Navbar</h2>
            <p className="text-gray-600 mb-6">
              Start by generating a navbar for your website. This will create a basic navbar structure that you can customize later.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Generate Navbar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar Settings (shown after generation) */}
      {settings && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Navbar Settings</h2>
            <button
              onClick={handleToggleActive}
              className={`px-4 py-2 rounded-lg ${
                settings.is_active 
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {settings.is_active ? 'Hide Navbar' : 'Show Navbar'}
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Logo & Site Name</h2>
            
            {/* Logo Section */}
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <MediaPicker
                value={settings.logo_url || ''}
                onChange={handleLogoChange}
                onRemove={handleLogoRemove}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Site Name
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={siteName}
                  onChange={handleSiteNameChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Enter your site name"
                />
                <button
                  onClick={handleUpdateSiteName}
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                  <div className="flex items-center gap-4">
                    {settings.logo_url && (
                      <img 
                        src={settings.logo_url} 
                        alt="Logo" 
                        className="h-8 w-auto object-contain"
                      />
                    )}
                    <span className="font-medium">{settings.site_name}</span>
                  </div>
                  {/* Sample menu items */}
                  <div className="flex gap-4 text-sm">
                    <span>Home</span>
                    <span>About</span>
                    <span>Contact</span>
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