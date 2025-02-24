'use client';

import  Sidebar  from "@/components/dashboard/Sidebar";
import Header from '@/components/dashboard/Header';
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={cn(
        "flex flex-col flex-1 transition-all duration-200",
        isCollapsed ? "ml-[3.05rem]" : "ml-[15rem]"
      )}>
        <Header />
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}