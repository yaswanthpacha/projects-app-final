"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [theme, setTheme] = useState("light");

  // Load saved theme on first render
  useEffect(() => {
    const stored = localStorage.getItem("theme") || "light";
    setTheme(stored);
    document.documentElement.classList.add(stored);
  }, []);

  // Apply theme dynamically
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // redirect to login after logout
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white dark:bg-gray-900">
      {/* Left navigation */}
      <nav className="flex gap-4">
        <Link href="/" className={pathname === "/" ? "font-bold" : ""}>Dashboard</Link>
        <Link href="/projects" className={pathname === "/projects" ? "font-bold" : ""}>Projects</Link>
        <Link href="/search" className={pathname === "/search" ? "font-bold" : ""}>Search</Link>
      </nav>

      {/* Centered Logo */}
      <div className="flex-1 flex justify-center">
        <img src="/logo.png" alt="Zenardy Logo" className="h-12 w-auto object-contain" />
      </div>

      {/* Right side controls */}
      <div className="flex gap-3">
        <button
          onClick={toggleTheme}
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-lg bg-red-500 text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
