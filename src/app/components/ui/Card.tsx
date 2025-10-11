"use client";
import { motion } from "framer-motion";
import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="bg-[var(--moteva-surface)] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl card-hover transition-colors duration-300"
    >
      {children}
    </motion.div>
  );
}
