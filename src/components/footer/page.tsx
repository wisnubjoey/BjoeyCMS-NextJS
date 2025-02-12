'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface FooterSettings {
  id: number;
  is_active: boolean;
  is_generated: boolean;
  company_name: string;
  description: string;
  copyright_text: string;
  social_links: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  quick_links: Array<{
    title: string;
    url: string;
  }>;
  contact_info: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export default function FooterPage() {
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  const checkFooter = async () => {
    try {
      const response = await api.get('/footer/check');
      if (!response.data.is_generated) {
        setShowGenerateModal(true);
      } else {
        setSettings(response.data.settings);
      }
    } catch (error) {
      toast.error('Failed to check footer status');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      const response = await api.post('/footer/generate');
      setSettings(response.data);
      setShowGenerateModal(false);
      toast.success('Footer generated successfully');
    } catch (error) {
      toast.error('Failed to generate footer');
    }
  };

  const handleToggleActive = async () => {
    try {
      const response = await api.post('/footer/toggle');
      setSettings(response.data);
      toast.success(response.data.is_active ? 'Footer activated' : 'Footer deactivated');
    } catch (error) {
      toast.error('Failed to toggle footer');
    }
  };

  const handleUpdate = async (newSettings: Partial<FooterSettings>) => {
    try {
      const response = await api.put('/footer/update', {
        ...settings,
        ...newSettings
      });
      setSettings(response.data);
      toast.success('Footer updated successfully');
    } catch (error) {
      toast.error('Failed to update footer');
    }
  };

  const handleAddQuickLink = () => {
    if (!settings) return;

    const updatedLinks = [...settings.quick_links, newLink];
    handleUpdate({ quick_links: updatedLinks });
    setShowAddLink(false);
    setNewLink({ title: '', url: '' });
  };

  const handleRemoveQuickLink = (index: number) => {
    if (!settings) return;

    const updatedLinks = settings.quick_links.filter((_, i) => i !== index);
    handleUpdate({ quick_links: updatedLinks });
  };

  useEffect(() => {
    checkFooter();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Generate Footer</h2>
            <p className="text-gray-600 mb-6">
              Start by generating a footer section for your website. You can customize it later.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Generate Footer
              </button>
            </div>
          </div>
        </div>
      )}

      {settings && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Footer Settings</h1>
            <button
              onClick={handleToggleActive}
              className={`px-4 py-2 rounded-lg ${
                settings.is_active 
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {settings.is_active ? 'Hide Footer' : 'Show Footer'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            {/* Company Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={settings.company_name}
                    onChange={(e) => handleUpdate({ company_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={settings.description}
                    onChange={(e) => handleUpdate({ description: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Copyright Text</label>
                  <input
                    type="text"
                    value={settings.copyright_text}
                    onChange={(e) => handleUpdate({ copyright_text: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Social Links</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facebook</label>
                  <input
                    type="url"
                    value={settings.social_links.facebook || ''}
                    onChange={(e) => handleUpdate({
                      social_links: { ...settings.social_links, facebook: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Twitter</label>
                  <input
                    type="url"
                    value={settings.social_links.twitter || ''}
                    onChange={(e) => handleUpdate({
                      social_links: { ...settings.social_links, twitter: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instagram</label>
                  <input
                    type="url"
                    value={settings.social_links.instagram || ''}
                    onChange={(e) => handleUpdate({
                      social_links: { ...settings.social_links, instagram: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Quick Links</h2>
                <button
                  onClick={() => setShowAddLink(true)}
                  className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Link
                </button>
              </div>
              <div className="space-y-2">
                {settings.quick_links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{link.title}</p>
                      <p className="text-sm text-gray-500">{link.url}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveQuickLink(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={settings.contact_info.email || ''}
                    onChange={(e) => handleUpdate({
                      contact_info: { ...settings.contact_info, email: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={settings.contact_info.phone || ''}
                    onChange={(e) => handleUpdate({
                      contact_info: { ...settings.contact_info, phone: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={settings.contact_info.address || ''}
                    onChange={(e) => handleUpdate({
                      contact_info: { ...settings.contact_info, address: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Quick Link Modal */}
      {showAddLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Quick Link</h2>
              <button
                onClick={() => setShowAddLink(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="text"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddLink(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuickLink}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}