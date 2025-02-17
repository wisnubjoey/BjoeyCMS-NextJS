'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Settings,
  Layout,
  Navigation,
  LayoutTemplate,
  ChevronDown,
  ChevronUp,
  ListCheck,
  AlignEndHorizontal,
  File
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  title: string;
  path?: string;
  icon: any;
  items?: {
    name: string;
    path: string;
    icon: any;
  }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Sections",
    icon: Layout,
    items: [
      {
        name: "Navbar",
        path: "/dashboard/navbar",
        icon: Navigation
      },
      {
        name: "Hero Section",
        path: "/dashboard/hero",
        icon: LayoutTemplate
      },
      {
        name: "Features",
        path: "/dashboard/features",
        icon: ListCheck
      },
      {
        name: "Footer",
        path: "/dashboard/footer",
        icon: AlignEndHorizontal
      }
    ]
  },
  {
    title: "Posts",
    path: "/dashboard/post",
    icon: FileText
  },
  {
    title: "Media",
    path: "/dashboard/media",
    icon: Image
  },
  {
    title: "Pages",
    path: "/dashboard/pages",
    icon: File
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: Settings
  }

];


export default function Sidebar() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>("Sections");

  return (
    <div className="bg-white w-64 h-screen border-r">
      <div className="p-4">
        <h1 className="text-xl font-bold">CMS Admin</h1>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          if (item.items) {
            // Menu with sub-items
            return (
              <div key={item.title}>
                <button
                  onClick={() => setOpenGroup(openGroup === item.title ? null : item.title)}
                  className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3" />
                    {item.title}
                  </div>
                  {openGroup === item.title ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                
                {openGroup === item.title && (
                  <div className="ml-4">
                    {item.items.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                            pathname === subItem.path ? 'bg-gray-100' : ''
                          }`}
                        >
                          <SubIcon className="w-5 h-5 mr-3" />
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Menu without sub-items
          return (
            <Link
              key={item.path}
              href={item.path!}
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                pathname === item.path ? 'bg-gray-100' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}