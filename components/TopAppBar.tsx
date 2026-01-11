"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TopAppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push("/login");
  };

  const menuItems = [
    { name: "홈", href: "/" },
    { name: "게시판", href: "/board" },
    { name: "검색", href: "/search" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 shadow-sm h-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold text-slate-100 tracking-tight">
              <span className="text-blue-500">Zeus</span>
            </span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-400"
                    : "text-slate-400 hover:text-blue-300"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
            >
              로그아웃
            </button>
          ) : (
            <Link
              href="/login"
              className={`text-sm font-medium transition-colors ${
                pathname === "/login"
                  ? "text-blue-400"
                  : "text-slate-400 hover:text-blue-300"
              }`}
            >
              로그인
            </Link>
          )}
        </nav>

        <div className="md:hidden">
          <button className="text-slate-400 hover:text-slate-200">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
