"use client";

import { motion } from "framer-motion";

interface LivePreviewProps {
  isLive?: boolean;
  agenda: string;
  notes: string;
  protocol: string;
}

export default function LivePreview({
  isLive = false,
  agenda,
  notes,
  protocol,
}: LivePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`p-6 rounded-2xl border shadow-sm transition-all duration-500 ${
        isLive
          ? "bg-white/95 dark:bg-slate-900/80 border-green-300 shadow-green-200/60"
          : "bg-white/80 dark:bg-slate-900/70 border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Liveförhandsgranskning
        </h3>
        {isLive && (
          <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
            Pågående möte
          </span>
        )}
      </div>

      <div className="prose prose-sm dark:prose-invert text-gray-700 dark:text-gray-300 max-w-none">
        <h4 className="font-semibold text-green-600 dark:text-green-400 mb-1">
          Dagordning
        </h4>
        <pre className="whitespace-pre-wrap text-sm mb-4">{agenda || "—"}</pre>

        <h4 className="font-semibold text-green-600 dark:text-green-400 mb-1">
          Anteckningar
        </h4>
        <pre className="whitespace-pre-wrap text-sm mb-4">{notes || "—"}</pre>

        <h4 className="font-semibold text-green-600 dark:text-green-400 mb-1">
          Protokoll
        </h4>
        <pre className="whitespace-pre-wrap text-sm">{protocol || "—"}</pre>
      </div>
    </motion.div>
  );
}
