"use client";
import React from "react";

export default function Hero() {
  return (
    <section className="text-center py-28 bg-gradient-to-b from-white to-gray-50 dark:from-[#0b1220] dark:to-[#111827] relative hero-glow">
      <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
        AI-assistenten för smarta möten{" "}
        <span className="text-[var(--moteva-blue)]">SE</span>
      </h1>
      <p className="text-gray-600 dark:text-[var(--moteva-subtext)] max-w-2xl mx-auto mb-8 text-lg">
        Moteva hjälper svenska föreningar att skapa dagordningar, protokoll och
        mötesanteckningar – helt automatiskt med AI.
      </p>
      <div className="flex justify-center gap-4">
        <button className="bg-[var(--moteva-blue)] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-400/20">
          Skapa nytt möte
        </button>
        <button className="border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
          Läs mer
        </button>
      </div>
    </section>
  );
}
