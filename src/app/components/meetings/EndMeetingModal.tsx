"use client";

import { AnimatePresence, motion } from "framer-motion";

interface EndMeetingModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function EndMeetingModal({
  open,
  loading = false,
  onCancel,
  onConfirm,
}: EndMeetingModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90]"
          />
          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-[91] flex items-center justify-center px-4"
          >
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                Avsluta möte?
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Är du säker på att du vill avsluta mötet? <br />
                <span className="font-medium">Allt innehåll sparas automatiskt</span> innan vi avslutar.
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  Avbryt
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`px-4 py-2 rounded-full text-sm font-semibold text-white transition ${
                    loading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-rose-500 to-red-600 hover:brightness-110"
                  }`}
                >
                  {loading ? "Avslutar…" : "Avsluta möte"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
