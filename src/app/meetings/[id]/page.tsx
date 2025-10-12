"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  FileText,
  NotebookPen,
  Loader2,
  Download,
  Edit3,
  Save,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

interface Meeting {
  id: string;
  title: string;
  date: string;
  agenda?: string | null;
  notes?: string | null;
  protocol?: string | null;
  createdAt: string;
}

export default function MeetingDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [focusedSection, setFocusedSection] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    agenda: "",
    notes: "",
    protocol: "",
  });

  useEffect(() => {
    async function fetchMeeting() {
      try {
        const res = await fetch(`/api/meetings/${params.id}`);
        if (!res.ok) throw new Error("Kunde inte hämta mötet.");
        const data = await res.json();
        setMeeting(data);
        setFormData({
          title: data.title || "",
          date: data.date ? data.date.split("T")[0] : "",
          agenda: data.agenda || "",
          notes: data.notes || "",
          protocol: data.protocol || "",
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Ett fel uppstod.");
      } finally {
        setLoading(false);
      }
    }
    fetchMeeting();
  }, [params.id]);

  const handleDownloadPDF = async () => {
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
    } catch (err) {
      toast.error("Ett fel uppstod vid nedladdning av PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!meeting) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/meetings/${meeting.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: formData.date || new Date().toISOString().split("T")[0],
        }),
      });
      if (!res.ok) throw new Error("Kunde inte uppdatera mötet.");
      const updated = await res.json();
      setMeeting(updated);
      setEditing(false);
      toast.success("✅ Mötet har uppdaterats!");
    } catch (err) {
      toast.error("Fel vid uppdatering av mötet.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-600 dark:text-gray-300">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Laddar mötet...
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Fel: {error}
      </div>
    );

  if (!meeting)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Inget möte hittades.
      </div>
    );

  return (
    <div className="min-h-screen py-20 px-4 sm:px-8 flex flex-col items-center bg-gradient-to-b from-[#f7f9fc] via-[#f8f8fb] to-[#eef1f5] dark:from-[#0a0e16] dark:via-[#0e121d] dark:to-[#111827] transition-colors duration-700">
      <div className="w-full max-w-3xl bg-white/80 dark:bg-[#111827]/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl p-8 transition-all duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          {editing ? (
            <input
              type="text"
              className="text-3xl font-bold w-full sm:w-auto bg-transparent border-b border-gray-400 dark:border-gray-600 focus:outline-none text-gray-900 dark:text-gray-100"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{meeting.title}</h1>
          )}

          <div className="flex gap-3 mt-4 sm:mt-0">
            {editing ? (
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                {saving ? "Sparar..." : "Spara ändringar"}
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                <Edit3 className="w-4 h-4" />
                Redigera möte
              </button>
            )}
          </div>
        </div>

        {/* Datum */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Calendar className="w-4 h-4 mr-2 opacity-70" />
          {editing ? (
            <input
              type="date"
              className="bg-transparent border-b border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-0"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          ) : (
            new Date(meeting.date).toLocaleDateString("sv-SE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          )}
        </div>

        {/* Sektioner */}
        {["agenda", "notes", "protocol"].map((section) => (
          <div
            key={section}
            onFocus={() => setFocusedSection(section)}
            onBlur={() => setFocusedSection(null)}
            className={`mb-6 p-5 rounded-2xl bg-gray-50/80 dark:bg-[#1a1f2e]/70 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ${
              focusedSection === section
                ? "scale-[1.02] ring-2 ring-indigo-400 dark:ring-indigo-500 shadow-lg"
                : ""
            }`}
          >
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200 capitalize flex items-center gap-2">
              {section === "agenda" && <FileText className="w-4 h-4 opacity-70" />}
              {section === "notes" && <NotebookPen className="w-4 h-4 opacity-70" />}
              {section === "protocol" && <FileText className="w-4 h-4 opacity-70" />}
              {section === "agenda"
                ? "Dagordning"
                : section === "notes"
                ? "Anteckningar"
                : "Protokoll"}
            </h2>

            {editing ? (
              <textarea
                value={formData[section as keyof typeof formData] as string}
                onChange={(e) =>
                  setFormData({ ...formData, [section]: e.target.value })
                }
                rows={focusedSection === section ? 10 : 5}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-0"
              />
            ) : (
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                {meeting[section as keyof Meeting] || "–"}
              </p>
            )}
          </div>
        ))}

        {!editing && (
          <div className="mt-10 text-center">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white 
                bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400
                transition-all duration-300 ${
                  downloading ? "opacity-70 cursor-not-allowed" : "shadow-md"
                }`}
            >
              {downloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Genererar PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" /> Ladda ner som PDF
                </>
              )}
            </button>
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-6">
          Skapad:{" "}
          {new Date(meeting.createdAt).toLocaleString("sv-SE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      {/* 🔙 Flytande tillbaka-knapp */}
      <div className="fixed bottom-8 left-8 group">
        <button
          onClick={() => router.push("/meetings")}
          className="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full h-14 w-14 shadow-lg hover:w-48 transition-all duration-300 overflow-hidden"
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
