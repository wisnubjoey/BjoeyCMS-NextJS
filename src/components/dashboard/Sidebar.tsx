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
  LogOut,
  UserCircle,
  ChevronsUpDown,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const sidebarVariants = {
  open: { width: "15rem" },
  closed: { width: "3.05rem" },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
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
  },
  {
    title: "Products",
    path: "/dashboard/products",
    icon: ShoppingCart
  }
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <motion.div
      className={cn("sidebar fixed left-0 z-40 h-screen border-r")}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className="relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-white dark:bg-black transition-all"
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            <div className="flex h-[54px] w-full shrink-0 border-b p-2">
              <div className="mt-[1.5px] flex w-full">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="w-full" asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex w-fit items-center gap-2 px-2"
                    >
                      <Avatar className="rounded size-4">
                        <AvatarFallback>O</AvatarFallback>
                      </Avatar>
                      <motion.li
                        variants={variants}
                        className="flex w-fit items-center gap-2"
                      >
                        {!isCollapsed && (
                          <>
                            <p className="text-sm font-medium">Bjoey CMS</p>
                          </>
                        )}
                      </motion.li>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[180px]">
                    {/* Add organization menu items here */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className={cn("flex w-full flex-col gap-1")}>
                    {menuItems.map((item) => (
                      <div key={item.title}>
                        {!item.items ? (
                          <Link
                            href={item.path || '#'}
                            className={cn(
                              "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                              pathname === item.path && "bg-muted text-blue-600"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            <motion.li variants={variants}>
                              {!isCollapsed && (
                                <p className="ml-2 text-sm font-medium">{item.title}</p>
                              )}
                            </motion.li>
                          </Link>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => setOpenSection(openSection === item.title ? null : item.title)}
                              className={cn(
                                "flex h-8 w-full items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                                openSection === item.title && "bg-muted text-blue-600"
                              )}
                            >
                              <item.icon className="h-4 w-4" />
                              {!isCollapsed && (
                                <motion.li variants={variants} className="flex flex-1 items-center">
                                  <span className="ml-2 text-sm font-medium">{item.title}</span>
                                  {openSection === item.title ? (
                                    <ChevronUp className="ml-auto h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="ml-auto h-4 w-4" />
                                  )}
                                </motion.li>
                              )}
                            </button>
                            {openSection === item.title && !isCollapsed && (
                              <div className="ml-4 flex flex-col gap-1">
                                {item.items.map((subItem) => (
                                  <Link
                                    key={subItem.path}
                                    href={subItem.path}
                                    className={cn(
                                      "flex h-8 w-full items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                                      pathname === subItem.path && "bg-muted text-blue-600"
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
              </div>
              <div className="flex flex-col p-2">
                <div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full">
                      <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                        <Avatar className="size-4">
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <motion.li
                          variants={variants}
                          className="flex w-full items-center gap-2"
                        >
                          {!isCollapsed && (
                            <>
                              <p className="text-sm font-medium">Account</p>
                              <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                            </>
                          )}
                        </motion.li>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={5}>
                      <div className="flex flex-row items-center gap-2 p-2">
                        <Avatar className="size-6">
                          <AvatarFallback>AL</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">User Name</span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            user@example.com
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="flex items-center gap-2">
                        <Link href="/settings/profile">
                          <UserCircle className="h-4 w-4" /> Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}