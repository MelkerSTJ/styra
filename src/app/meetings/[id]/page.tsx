"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  Download,
  Calendar,
  Power,
  ArrowLeft,
  Info,
  CheckCircle2,
} from "lucide-react";

import EditableSection from "@/app/components/meeting/EdittableSection";
import LivePreview from "@/app/components/meeting/LivePreview";
import EndMeetingModal from "@/app/components/meeting/EndMeetingModal";

interface Meeting {
  id: string;
  title: string;
  date: string;
  agenda?: string | null;
  notes?: string | null;
  protocol?: string | null;
  createdAt: string;
  status?: string | null;
}

export default function MeetingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [ending, setEnding] = useState(false);

  // 🗂️ Hämta möte
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await fetch(`/api/meetings/${params.id}`);
        if (!res.ok) throw new Error("Kunde inte hämta mötet.");
        const data = await res.json();
        setMeeting(data);
        if (data.status === "avslutat") setIsEnded(true);
      } catch {
        toast.error("Fel vid hämtning av möte.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeeting();
  }, [params.id]);

  // 🧠 Starta / avsluta möte
  const handleToggleLive = async () => {
    if (!meeting) return;

    // Starta mötet
    if (!isLive && !isEnded) {
      toast.success("Mötet har startat ✨");
      setIsLive(true);
      return;
    }

    // Öppna modal istället för alert
    if (isLive) {
      setShowEndModal(true);
    }
  };

  // 🧾 Bekräfta avslut
  const handleConfirmEnd = async () => {
    if (!meeting) return;
    setEnding(true);
    try {
      const res = await fetch(`/api/meetings/${meeting.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agenda: meeting.agenda,
          notes: meeting.notes,
          protocol: meeting.protocol,
          status: "avslutat",
        }),
      });

      if (!res.ok) throw new Error("Kunde inte uppdatera mötet.");

      setIsLive(false);
      setIsEnded(true);
      setShowEndModal(false);

      toast.success("Mötet avslutades och sparades ✅");
    } catch {
      toast.error("Kunde inte avsluta mötet.");
    } finally {
      setEnding(false);
    }
  };

  const handleExportPDF = async () => {
    if (!meeting) return;
    try {
      setDownloading(true);
      const res = await fetch(`/api/pdf?id=${meeting.id}`);
      if (!res.ok) throw new Error("Kunde inte generera PDF.");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${meeting.title}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF genererad och nedladdad 📄");
    } catch {
      toast.error("Ett fel uppstod vid PDF-export.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-600 dark:text-gray-300">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Laddar mötet...
      </div>
    );

  if (!meeting)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Inget möte hittades.
      </div>
    );

  return (
    <div className="relative min-h-screen flex flex-col items-center py-16 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950 transition-all duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full max-w-5xl mb-8 gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {meeting.title}
          </h1>
          <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(meeting.date).toLocaleDateString("sv-SE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Knapp + Låsruta */}
        <div className="flex flex-col items-end gap-2">
          <motion.button
            onClick={handleToggleLive}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={ending}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm shadow-md transition-all ${
              isEnded
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : isLive
                ? "bg-gradient-to-r from-rose-500 to-red-600 text-white"
                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
            }`}
          >
            {ending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sparar...
              </>
            ) : (
              <>
                <Power className="w-4 h-4" />
                {isLive
                  ? "Avsluta möte"
                  : isEnded
                  ? "Möte avslutat"
                  : "Starta möte"}
              </>
            )}
          </motion.button>

          {!isLive && !isEnded && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100/80 dark:from-slate-800 dark:to-slate-900 border border-blue-200/60 dark:border-slate-700 text-sm text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl shadow-sm"
            >
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="font-medium">
                Redigering låst –{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  starta mötet
                </span>{" "}
                för att skriva.
              </p>
            </motion.div>
          )}

          {isEnded && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-sm text-green-700 dark:text-green-300 px-4 py-2 rounded-xl shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p>Mötet är avslutat och sparat ✅</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Innehåll */}
      <motion.div
        layout
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="grid w-full max-w-5xl gap-6 md:grid-cols-2"
      >
        <div className="flex flex-col gap-6">
          <EditableSection
            title="Dagordning"
            content={meeting.agenda || ""}
            onChange={(value) =>
              setMeeting((prev) => (prev ? { ...prev, agenda: value } : null))
            }
            isEditable={isLive}
          />
          <EditableSection
            title="Anteckningar"
            content={meeting.notes || ""}
            onChange={(value) =>
              setMeeting((prev) => (prev ? { ...prev, notes: value } : null))
            }
            isEditable={isLive}
          />
          <EditableSection
            title="Protokoll"
            content={meeting.protocol || ""}
            relatedNotes={meeting.notes || ""}
            onChange={(value) =>
              setMeeting((prev) => (prev ? { ...prev, protocol: value } : null))
            }
            isEditable={isLive}
          />
        </div>

        <LivePreview
          isLive={isLive}
          agenda={meeting.agenda || ""}
          notes={meeting.notes || ""}
          protocol={meeting.protocol || ""}
        />
      </motion.div>

      {/* PDF visas endast EFTER möte avslutats */}
      <AnimatePresence>
        {isEnded && (
          <motion.div
            key="pdfbutton"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-10"
          >
            <motion.button
              onClick={handleExportPDF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-200 dark:shadow-blue-900/30"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Genererar PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Exportera PDF
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal för avslut */}
      <EndMeetingModal
        open={showEndModal}
        loading={ending}
        onCancel={() => setShowEndModal(false)}
        onConfirm={handleConfirmEnd}
      />

      {/* Tillbaka-knapp */}
      <div className="fixed bottom-8 left-8 group">
        <button
          onClick={() => router.push("/meetings")}
          className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full h-14 w-14 shadow-lg hover:w-48 transition-all duration-300 overflow-hidden"
        >
          <ArrowLeft className="w-5 h-5 shrink-0 transition-all duration-300 group-hover:mr-2" />
          <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
            Tillbaka till möten
          </span>
        </button>
      </div>
    </div>
  );
}
