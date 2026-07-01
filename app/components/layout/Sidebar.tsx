"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  History,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/app/lib/utils";
import { useAuth } from "@/app/contexts/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/repositories", label: "Repositories", icon: FolderGit2 },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
        <div className="flex h-7 w-7 items-center justify-center text-white">
          <img
            src="/lotus.svg"
            alt="Nascent"
            className="h-6 w-6"
          />
        </div>
        <div>
          <p className="text-base font-bold tracking-tight text-white leading-none">Nascent</p>
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mt-1 font-medium">AI Software Engineer</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-hover text-white border border-border/40"
                  : "text-neutral-400 hover:bg-hover hover:text-white border border-transparent"
              )}
            >
              <Icon className="h-4 w-4 shrink-0 text-neutral-400" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      {user && (
        <div className="border-t border-border p-4 bg-black/20">
          <div className="flex items-center gap-3 p-1.5 rounded-lg border border-transparent">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 border border-border text-xs font-semibold text-neutral-200">
              {user.github_username.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white leading-none">{user.github_username}</p>
              <p className="truncate text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">
                {user.github_installation_id ? "Active Developer" : "Setup Required"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <button
        className="fixed top-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-[var(--sidebar-width)] flex-col bg-surface border-r border-border">
            <button
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[var(--sidebar-width)] flex-col border-r border-border bg-surface">
        <NavContent />
      </aside>
    </>
  );
}
