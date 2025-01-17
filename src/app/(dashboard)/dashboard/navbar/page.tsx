'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import MediaPicker from '@/components/media/MediaPicker';
import { Plus, GripVertical, Pencil, Trash2 } from 'lucide-react';
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
import { SortableMenuItem } from '@/components/navbar/SortableMenuItem';

// Types
interface NavbarSettings {
  id: number;
  is_active: boolean;
  is_generated: boolean;
  logo_url: string | null;
  site_name: string;
  settings: any;
}

interface MenuItem {
  id: number;
  title: string;
  link: string;
  type: 'custom' | 'page';
  order: number;
  is_active: boolean;
}

export default function NavbarPage() {
    const [loading, setLoading] = useState(true);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [settings, setSettings] = useState<NavbarSettings | null>(null);
    const [saving, setSaving] = useState(false);
    const [siteName, setSiteName] = useState('');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [newMenuItem, setNewMenuItem] = useState({
      title: '',
      link: '',
      type: 'custom' as const
    });
    const [loadingMenuItems, setLoadingMenuItems] = useState(true);
    const [showEditMenu, setShowEditMenu] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

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

  useEffect(() => {
    if (settings?.id) {
      fetchMenuItems();
    }
  }, [settings?.id]);

  const fetchMenuItems = async () => {
    try {
      if (!settings?.id) return;
      
      setLoadingMenuItems(true);
      const response = await api.get(`/navbar/${settings.id}/menu-items`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      toast.error('Failed to fetch menu items');
    } finally {
      setLoadingMenuItems(false);
    }
  };

  const handleAddMenuItem = async () => {
    try {
      if (!settings) return;
      
      const response = await api.post(`/navbar/${settings.id}/menu-items`, newMenuItem);
      
      // Refresh menu items
      const menuResponse = await api.get(`/navbar/${settings.id}/menu-items`);
      setMenuItems(menuResponse.data);
      
      // Reset form dan tutup modal
      setNewMenuItem({ title: '', link: '', type: 'custom' });
      setShowAddMenu(false);
      toast.success('Menu item added successfully');
    } catch (error) {
      console.error('Failed to add menu item:', error);
      toast.error('Failed to add menu item');
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await api.delete(`/navbar/menu-items/${id}`);
      
      if (settings?.id) {
        await fetchMenuItems();
      }
      
      toast.success('Menu item deleted successfully');
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  const handleEditMenuItem = async () => {
    try {
      if (!editingMenuItem) return;
      
      await api.put(`/navbar/menu-items/${editingMenuItem.id}`, {
        title: editingMenuItem.title,
        link: editingMenuItem.link,
        type: editingMenuItem.type
      });
      
      await fetchMenuItems();
      setShowEditMenu(false);
      setEditingMenuItem(null);
      toast.success('Menu item updated successfully');
    } catch (error) {
      console.error('Failed to update menu item:', error);
      toast.error('Failed to update menu item');
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    setMenuItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      return arrayMove(items, oldIndex, newIndex);
    });

    try {
      // Update order in backend
      await api.post(`/navbar/${settings?.id}/menu-items/reorder`, {
        items: menuItems.map((item, index) => ({
          id: item.id,
          order: index
        }))
      });
      toast.success('Menu order updated');
    } catch (error) {
      console.error('Failed to update menu order:', error);
      toast.error('Failed to update menu order');
      // Optionally refresh menu items to restore original order
      await fetchMenuItems();
    }
  };

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

      {/* Menu Items Section */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Menu Items</h2>
          <button
            onClick={() => setShowAddMenu(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </button>
        </div>

        {/* Menu Items List */}
        {loadingMenuItems ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : Array.isArray(menuItems) && menuItems.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={menuItems.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <SortableMenuItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    link={item.link}
                    onEdit={() => {
                      setEditingMenuItem(item);
                      setShowEditMenu(true);
                    }}
                    onDelete={() => handleDeleteMenuItem(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <p className="text-gray-500 text-center py-4">No menu items found</p>
        )}

        {/* Add Menu Item Modal */}
        {showAddMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add Menu Item</h2>
                <button 
                  onClick={() => setShowAddMenu(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newMenuItem.title}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Enter menu title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newMenuItem.type}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, type: e.target.value as 'custom' | 'page' }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="custom">Custom Link</option>
                    <option value="page">Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link
                  </label>
                  <input
                    type="text"
                    value={newMenuItem.link}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Enter menu link"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setShowAddMenu(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMenuItem}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add Menu Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Menu Item Modal */}
        {showEditMenu && editingMenuItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Menu Item</h2>
                <button 
                  onClick={() => {
                    setShowEditMenu(false);
                    setEditingMenuItem(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingMenuItem.title}
                    onChange={(e) => setEditingMenuItem(prev => ({ ...prev!, title: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Enter menu title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={editingMenuItem.type}
                    onChange={(e) => setEditingMenuItem(prev => ({ ...prev!, type: e.target.value as 'custom' | 'page' }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="custom">Custom Link</option>
                    <option value="page">Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link
                  </label>
                  <input
                    type="text"
                    value={editingMenuItem.link}
                    onChange={(e) => setEditingMenuItem(prev => ({ ...prev!, link: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Enter menu link"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => {
                      setShowEditMenu(false);
                      setEditingMenuItem(null);
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditMenuItem}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Update Menu Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}