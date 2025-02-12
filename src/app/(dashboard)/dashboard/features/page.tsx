// src/app/(dashboard)/dashboard/features/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableFeatureItem } from '@/components/features/SortableFeatureItem';

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon?: string;
  order: number;
  is_active: boolean;
}

interface FeaturesSettings {
  id: number;
  is_active: boolean;
  is_generated: boolean;
  section_title: string;
  section_description: string;
  layout: 'grid' | 'columns' | 'cards';
  items: FeatureItem[];
  settings?: any;
}

export default function FeaturesPage() {
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [settings, setSettings] = useState<FeaturesSettings | null>(null);
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureItem | null>(null);
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const checkFeatures = async () => {
    try {
      const response = await api.get('/features/check');
      if (!response.data.is_generated) {
        setShowGenerateModal(true);
      } else {
        setSettings(response.data.settings);
      }
    } catch (error) {
      toast.error('Failed to check features status');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      const response = await api.post('/features/generate');
      setSettings(response.data);
      setShowGenerateModal(false);
      toast.success('Features section generated successfully');
    } catch (error) {
      toast.error('Failed to generate features section');
    }
  };

  const handleToggleActive = async () => {
    try {
      const response = await api.post('/features/toggle');
      setSettings(response.data);
      toast.success(response.data.is_active ? 'Features section activated' : 'Features section deactivated');
    } catch (error) {
      toast.error('Failed to toggle features section');
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<FeaturesSettings>) => {
    try {
      const response = await api.put('/features/update', {
        ...settings,
        ...newSettings
      });
      setSettings(response.data);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const handleAddFeature = async () => {
    try {
      await api.post('/features/items', newFeature);
      const response = await api.get('/features/check');
      setSettings(response.data.settings);
      setShowAddFeature(false);
      setNewFeature({ title: '', description: '' });
      toast.success('Feature added successfully');
    } catch (error) {
      toast.error('Failed to add feature');
    }
  };

  const handleUpdateFeature = async () => {
    if (!editingFeature) return;

    try {
      await api.put(`/features/items/${editingFeature.id}`, editingFeature);
      const response = await api.get('/features/check');
      setSettings(response.data.settings);
      setEditingFeature(null);
      toast.success('Feature updated successfully');
    } catch (error) {
      toast.error('Failed to update feature');
    }
  };

  const handleDeleteFeature = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    try {
      await api.delete(`/features/items/${id}`);
      const response = await api.get('/features/check');
      setSettings(response.data.settings);
      toast.success('Feature deleted successfully');
    } catch (error) {
      toast.error('Failed to delete feature');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    setSettings((prev) => {
      if (!prev) return null;

      const oldIndex = prev.items.findIndex((item) => item.id === active.id);
      const newIndex = prev.items.findIndex((item) => item.id === over.id);
      
      const newItems = arrayMove(prev.items, oldIndex, newIndex);
      return {
        ...prev,
        items: newItems.map((item, index) => ({ ...item, order: index + 1 }))
      };
    });

    try {
      await api.post('/features/items/reorder', {
        items: settings?.items.map((item, index) => ({
          id: item.id,
          order: index + 1
        }))
      });
    } catch (error) {
      toast.error('Failed to update order');
      checkFeatures();
    }
  };

  useEffect(() => {
    checkFeatures();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Generate Features Section</h2>
            <p className="text-gray-600 mb-6">
              Start by generating a features section for your website. You can customize it later.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Generate Features
              </button>
            </div>
          </div>
        </div>
      )}

      {settings && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Features Section</h1>
            <button
              onClick={handleToggleActive}
              className={`px-4 py-2 rounded-lg ${
                settings.is_active 
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {settings.is_active ? 'Hide Features' : 'Show Features'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            {/* Section Settings */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Section Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Section Title</label>
                  <input
                    type="text"
                    value={settings.section_title}
                    onChange={(e) => handleUpdateSettings({ section_title: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Section Description</label>
                  <textarea
                    value={settings.section_description}
                    onChange={(e) => handleUpdateSettings({ section_description: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Layout</label>
                  <select
                    value={settings.layout}
                    onChange={(e) => handleUpdateSettings({ layout: e.target.value as 'grid' | 'columns' | 'cards' })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="grid">Grid</option>
                    <option value="columns">Columns</option>
                    <option value="cards">Cards</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Features</h2>
                <button
                  onClick={() => setShowAddFeature(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </button>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={settings.items.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {settings.items.map((item) => (
                      <SortableFeatureItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        onEdit={() => setEditingFeature(item)}
                        onDelete={() => handleDeleteFeature(item.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Preview */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <div className="border rounded-lg p-8 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">{settings.section_title}</h2>
                    <p className="text-gray-600">{settings.section_description}</p>
                  </div>

                  <div className={`
                    grid gap-8
                    ${settings.layout === 'grid' ? 'grid-cols-3' : 
                      settings.layout === 'columns' ? 'grid-cols-1' : 
                      'grid-cols-2'}
                  `}>
                    {settings.items.map((item) => (
                      <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Feature Modal */}
      {(showAddFeature || editingFeature) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingFeature ? 'Edit Feature' : 'Add Feature'}
              </h2>
              <button 
                onClick={() => {
                  setShowAddFeature(false);
                  setEditingFeature(null);
                }}
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
                  value={editingFeature ? editingFeature.title : newFeature.title}
                  onChange={(e) => {
                    if (editingFeature) {
                      setEditingFeature({ ...editingFeature, title: e.target.value });
                    } else {
                      setNewFeature({ ...newFeature, title: e.target.value });
                    }
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editingFeature ? editingFeature.description : newFeature.description}
                  onChange={(e) => {
                    if (editingFeature) {
                      setEditingFeature({ ...editingFeature, description: e.target.value });
                    } else {
                      setNewFeature({ ...newFeature, description: e.target.value });
                    }
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowAddFeature(false);
                    setEditingFeature(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={editingFeature ? handleUpdateFeature : handleAddFeature}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingFeature ? 'Update Feature' : 'Add Feature'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}