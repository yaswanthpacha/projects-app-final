"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    }
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-md bg-black text-white">
      {/* Left Navigation */}
      <nav className="flex gap-6">
        <Link href="/" className={pathname === "/" ? "text-cyan-400" : ""}>
          Dashboard
        </Link>
        <Link
          href="/projects"
          className={pathname === "/projects" ? "text-cyan-400" : ""}
        >
          Projects
        </Link>
        <Link
          href="/search"
          className={pathname === "/search" ? "text-cyan-400" : ""}
        >
          Search
        </Link>
      </nav>

      {/* Center Logo */}
      <div className="flex justify-center">
        <Image
          src="/logo.png"
          alt="Zenardy Logo"
          width={140}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Right Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-lg border border-red-500 bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
