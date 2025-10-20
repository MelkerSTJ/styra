"use client";

import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function EmptyState({
  title = "Inga möten ännu",
  description = "Skapa ditt första möte för att komma igång.",
  ctaText = "➕ Skapa nytt möte",
  ctaHref = "/meetings/new",
}: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 mb-4">
        <CalendarPlus className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      <button
        onClick={() => router.push(ctaHref)}
        className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white
        bg-gradient-to-r from-indigo-600 to-blue-500 hover:brightness-110 shadow-lg shadow-indigo-200/50
        dark:shadow-indigo-900/30 transition-all"
      >
        {ctaText}
      </button>
    </div>
  );
}
