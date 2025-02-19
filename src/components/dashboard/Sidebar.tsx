'use client';

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
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
  File,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarVariants = {
  open: { width: "15rem" },
  closed: { width: "3.05rem" },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { x: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: { x: { stiffness: 100 } },
  },
};

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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <motion.div
      className={cn("sidebar fixed left-0 z-40 h-full shrink-0 border-r bg-background")}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <ScrollArea className="h-full py-2">
        <div className="flex flex-col gap-1 px-2">
          {menuItems.map((item) => (
            <div key={item.title}>
              {!item.items ? (
                <Link
                  href={item.path || '#'}
                  className={cn(
                    "flex h-8 w-full items-center rounded-md px-2 py-1.5 transition-colors hover:bg-muted hover:text-primary",
                    pathname === item.path && "bg-muted text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <motion.span
                    variants={variants}
                    className="ml-2 text-sm font-medium"
                    animate={isCollapsed ? "closed" : "open"}
                  >
                    {!isCollapsed && item.title}
                  </motion.span>
                </Link>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setOpenSection(openSection === item.title ? null : item.title)}
                    className={cn(
                      "flex h-8 w-full items-center rounded-md px-2 py-1.5 transition-colors hover:bg-muted hover:text-primary",
                      openSection === item.title && "bg-muted text-primary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && (
                      <>
                        <motion.span variants={variants} className="ml-2 flex-1 text-sm font-medium">
                          {item.title}
                        </motion.span>
                        {openSection === item.title ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                  {openSection === item.title && !isCollapsed && (
                    <div className="ml-4 flex flex-col gap-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={cn(
                            "flex h-8 w-full items-center rounded-md px-2 py-1.5 transition-colors hover:bg-muted hover:text-primary",
                            pathname === subItem.path && "bg-muted text-primary"
                          )}
                        >
                          <subItem.icon className="h-4 w-4" />
                          <span className="ml-2 text-sm font-medium">{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
}