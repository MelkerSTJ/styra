"use client";

import { useEffect, useState } from "react";

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
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Hämta mötesdata
  useEffect(() => {
    async function fetchMeeting() {
      try {
        const res = await fetch(`/api/meetings/${params.id}`);
        if (!res.ok) throw new Error("Kunde inte hämta mötet.");
        const data = await res.json();
        setMeeting(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Ett fel uppstod.");
      } finally {
        setLoading(false);
      }
    }
    fetchMeeting();
  }, [params.id]);

  // Ladda ner PDF
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
      console.error("Fel vid PDF-nedladdning:", err);
      alert("Ett fel uppstod vid nedladdning av PDF.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-20">Laddar mötet...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">Fel: {error}</p>;
  if (!meeting) return <p className="text-center mt-20">Inget möte hittades.</p>;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">{meeting.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Datum: {new Date(meeting.date).toLocaleDateString("sv-SE")}
      </p>

      <section className="space-y-6">
        {meeting.agenda && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-2">Dagordning</h2>
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{meeting.agenda}</p>
          </div>
        )}

        {meeting.notes && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-2">Anteckningar</h2>
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{meeting.notes}</p>
          </div>
        )}

        {meeting.protocol && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-2">Protokoll</h2>
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{meeting.protocol}</p>
          </div>
        )}
      </section>

      <div className="mt-10 flex justify-center">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className={`px-6 py-2 rounded-lg font-medium shadow-sm transition ${
            downloading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {downloading ? "Genererar PDF..." : "Ladda ner som PDF"}
        </button>
      </div>

      <p className="text-sm text-center text-gray-400 mt-8">
        Skapad: {new Date(meeting.createdAt).toLocaleString("sv-SE")}
      </p>
    </main>
  );
}
