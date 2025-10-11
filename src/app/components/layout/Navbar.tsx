"use client";
import Link from "next/link";
import ThemeToggle from "@/app/components/ui/ThemeToogle";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl transition-all duration-500 border-b ${
        scrolled
          ? "bg-white/90 dark:bg-[#0d1117]/90 border-gray-200/40 dark:border-gray-700/40 shadow-md"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        <Link
          href="/"
          className="text-xl font-semibold text-[var(--moteva-blue)] tracking-tight hover:opacity-90 transition-opacity"
        >
          Moteva
        </Link>
       <div className="flex items-center gap-6">
  <Link
    href="/meetings"
    className="font-medium text-gray-800 dark:text-white hover:text-[var(--moteva-blue)] transition-colors duration-200"
  >
    Möten
  </Link>
  <Link
    href="/about"
    className="font-medium text-gray-800 dark:text-white hover:text-[var(--moteva-blue)] transition-colors duration-200"
  >
    Om
  </Link>
  <ThemeToggle />
</div>


      </div>
    </nav>
  );
}
