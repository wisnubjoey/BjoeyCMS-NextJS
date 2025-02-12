'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

interface FooterSettings {
  is_active: boolean;
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

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/public/footer');
        if (response.data && response.data.is_active) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch footer');
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, []);

  if (loading || !settings || !settings.is_active) return null;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-semibold mb-4">{settings.company_name}</h3>
            <p className="text-gray-400 mb-4">{settings.description}</p>
            <div className="flex space-x-4">
              {settings.social_links.facebook && (
                <a href={settings.social_links.facebook} className="hover:text-white">
                  <Facebook size={20} />
                </a>
              )}
              {settings.social_links.twitter && (
                <a href={settings.social_links.twitter} className="hover:text-white">
                  <Twitter size={20} />
                </a>
              )}
              {settings.social_links.instagram && (
                <a href={settings.social_links.instagram} className="hover:text-white">
                  <Instagram size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {settings.quick_links.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="hover:text-white">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-4">
              {settings.contact_info.email && (
                <div className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  <a href={`mailto:${settings.contact_info.email}`} className="hover:text-white">
                    {settings.contact_info.email}
                  </a>
                </div>
              )}
              {settings.contact_info.phone && (
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  <a href={`tel:${settings.contact_info.phone}`} className="hover:text-white">
                    {settings.contact_info.phone}
                  </a>
                </div>
              )}
              {settings.contact_info.address && (
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>{settings.contact_info.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>{settings.copyright_text}</p>
        </div>
      </div>
    </footer>
  );
}