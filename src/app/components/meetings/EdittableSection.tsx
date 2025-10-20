"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

interface EditableSectionProps {
  title: string;
  content: string;
  onChange: (value: string) => void;
  relatedNotes?: string;
  isEditable?: boolean;
}

export default function EditableSection({
  title,
  content,
  onChange,
  relatedNotes,
  isEditable = true,
}: EditableSectionProps) {
  const [aiLoading, setAiLoading] = useState(false);

  // 🧠 Hantera AI-knapp (Förbättra anteckningar / Skapa protokoll)
  const handleAIAction = async () => {
    try {
      setAiLoading(true);

      const endpoint =
        title === "Protokoll"
          ? "/api/ai/generate-protocol"
          : "/api/ai/improve-notes";

      const body =
        title === "Protokoll"
          ? { notes: relatedNotes || "" }
          : { text: content };

      toast(
        title === "Protokoll"
          ? "AI skapar protokoll..."
          : "AI förbättrar dina anteckningar..."
      );

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("AI-förfrågan misslyckades.");
      const data = await res.json();

      const newText =
        title === "Protokoll" ? data.protocolText : data.improvedText;
      onChange(newText);

      toast.success(
        title === "Protokoll"
          ? "AI har skapat ett mötesprotokoll 📄"
          : "AI har förbättrat dina anteckningar ✨"
      );
    } catch (err) {
      toast.error("Kunde inte använda AI just nu.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <motion.div
      layout
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`p-5 rounded-2xl border relative transition-all duration-500 ${
        isEditable
          ? "bg-white/80 dark:bg-slate-900/70 border-gray-200 dark:border-slate-700 hover:shadow-md"
          : "bg-gray-50/80 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700 opacity-75"
      }`}
    >
      {/* Rubrik + AI-knapp */}
      <div className="flex justify-between items-center mb-2">
        <h2
          className={`font-semibold ${
            isEditable
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {title}
        </h2>

        {isEditable && (title === "Anteckningar" || title === "Protokoll") && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleAIAction}
            disabled={aiLoading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              aiLoading
                ? "bg-blue-100 text-blue-500 cursor-wait"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:brightness-110 shadow"
            }`}
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {title === "Protokoll" ? "Skapar..." : "Förbättrar..."}
              </>
            ) : (
              <>
                {title === "Protokoll" ? (
                  <FileText className="w-3.5 h-3.5" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {title === "Protokoll"
                  ? "Skapa protokoll med AI"
                  : "Förbättra med AI"}
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Textarea */}
      <motion.textarea
        key={title}
        layout
        rows={6}
        value={content}
        readOnly={!isEditable}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          isEditable
            ? `Skriv ${title.toLowerCase()} här...`
            : "Starta mötet för att börja redigera"
        }
        className={`w-full resize-none outline-none text-sm leading-relaxed rounded-xl p-3 transition-all duration-300 ${
          isEditable
            ? "bg-transparent text-gray-800 dark:text-gray-200 border border-transparent focus:ring-2 focus:ring-blue-400 dark:focus:ring-indigo-400 focus:border-blue-300"
            : "bg-transparent text-gray-400 dark:text-gray-500 cursor-not-allowed select-none"
        }`}
        whileFocus={isEditable ? { scale: 1.02 } : {}}
      />
    </motion.div>
  );
}
