"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Circle, Power } from "lucide-react";

interface MeetingHeaderProps {
  title: string;
  date: string;
  isLive: boolean;
  timer: number;
  onStart: () => void;
  onEnd: () => void;
}

export default function MeetingHeader({
  title,
  date,
  isLive,
  timer,
  onStart,
  onEnd,
}: MeetingHeaderProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
          <Calendar className="w-4 h-4" />
          {date &&
            new Date(date).toLocaleDateString("sv-SE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3"
      >
        {isLive && (
          <motion.div
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Circle className="w-3 h-3 fill-white animate-pulse" />
            Live
          </motion.div>
        )}

        {isLive && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 font-medium">
            <Clock className="w-4 h-4" /> {formatTime(timer)}
          </div>
        )}

        {isLive ? (
          <button
            onClick={onEnd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all shadow-sm bg-gradient-to-r from-rose-500 to-red-600 text-white hover:brightness-110"
          >
            <Power className="w-4 h-4" /> Avsluta
          </button>
        ) : (
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all shadow-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:brightness-110"
          >
            <Circle className="w-3 h-3 fill-white animate-pulse" /> Starta möte
          </button>
        )}
      </motion.div>
    </div>
  );
}
