"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { UserCircle, LogOut, Home, Users, CreditCard, Settings } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const { loadCategories } = useAdminStore();

  useEffect(() => {
    (async () => {
      try {
        await loadCategories();
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    })();
  }, [loadCategories]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-background">
        <Topbar />
        <main className="p-6 space-y-6 bg-background">{children}</main>
      </div>
    </div>
  );
}

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("auth_token");
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message || err);
    }
  };

  const menuItems = [
    { label: "Overview", href: "/dashboard/admin", icon: <Home size={18} /> },
    { label: "Providers", href: "/dashboard/admin/providers", icon: <Users size={18} /> },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: <CreditCard size={18} /> },
    { label: "Employees", href: "/dashboard/admin/employees", icon: <Users size={18} /> },
    { label: "Categories", href: "/dashboard/admin/categories", icon: <Settings size={18} /> },
    { label: "Logout", href: "#", icon: <LogOut size={18} />, action: handleLogout },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col">
      <div className="p-4 flex items-center">
        <img src="/logo.png" alt="TipTop Logo" className="h-20 w-auto" />
      </div>
      <nav className="flex-1 flex flex-col gap-1 mt-2 px-2">
        {menuItems.map((item) =>
          item.action ? (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 hover:bg-accent text-foreground text-left"
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 hover:bg-accent text-foreground"
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </Link>
          )
        )}
      </nav>
    </aside>
  );
};

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("auth_token");
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message || err);
    }
  };

  return (
    <header className="flex justify-start items-center gap-4 px-6 py-4 bg-primary border-b border-border relative">
      <div className="text-xl font-bold">Admin Dashboard</div>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <UserCircle size={20} />
            <span className="hidden md:inline">Admin</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-primary border border-border rounded-xl py-2 z-50">
              <Link
                href="/dashboard/admin/categories"
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-input rounded-lg"
              >
                <Settings size={16} /> Categories
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-input rounded-lg"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
