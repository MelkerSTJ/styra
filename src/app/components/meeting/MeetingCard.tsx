"use client";

import { Calendar, FileText, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface MeetingCardProps {
  id: string;
  title: string;
  date: string;
  hasProtocol: boolean;
  status?: string | null;
}

export default function MeetingCard({
  id,
  title,
  date,
  hasProtocol,
  status,
}: MeetingCardProps) {
  const router = useRouter();

  const dateObj = new Date(date);
  const today = new Date();
  const isUpcoming = status !== "avslutat" && dateObj >= new Date(today.toDateString());
  const isEnded = status === "avslutat" || dateObj < new Date(today.toDateString());

  return (
    <div
      onClick={() => router.push(`/meetings/${id}`)}
      className="group p-6 rounded-2xl border cursor-pointer
      bg-white dark:bg-[#1a1f2e] border-gray-200 dark:border-gray-700
      hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-400 dark:hover:border-blue-500
      transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        {/* Status chip */}
        <span
          className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium
          ${isUpcoming
            ? "text-blue-700 border-blue-200 bg-blue-50 dark:text-blue-300 dark:border-blue-800 dark:bg-blue-900/30"
            : isEnded
              ? "text-gray-600 border-gray-200 bg-gray-50 dark:text-gray-300 dark:border-slate-700 dark:bg-slate-800/40"
              : "text-gray-600 border-gray-200 bg-gray-50 dark:text-gray-300 dark:border-slate-700 dark:bg-slate-800/40"
          }`}
        >
          {isUpcoming ? "Kommande" : "Avslutat"}
        </span>
      </div>

      <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
        <Calendar className="w-4 h-4 mr-2 opacity-70" />
        {new Date(date).toLocaleDateString("sv-SE", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>

      <div className="mt-2 flex items-center text-sm">
        {hasProtocol ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">Protokoll genererat</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <FileText className="w-4 h-4 opacity-70" />
            Protokoll saknas
          </span>
        )}
      </div>
    </div>
  );
}
