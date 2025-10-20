"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

interface MeetingsHeaderProps {
  title?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function MeetingsHeader({
  title = "Dina möten",
  ctaText = "➕ Skapa nytt möte",
  ctaHref = "/meetings/new",
}: MeetingsHeaderProps) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {title}
      </h1>

      <button
        onClick={() => router.push(ctaHref)}
        className="inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 text-sm font-semibold text-white
        bg-gradient-to-r from-indigo-600 to-blue-500 hover:brightness-110 shadow-lg shadow-indigo-200/50
        dark:shadow-indigo-900/30 transition-all"
      >
        <Plus className="w-4 h-4" />
        {ctaText}
      </button>
    </div>
  );
}
