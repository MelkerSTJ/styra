"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MeetingForm from "@/app/components/MeetingForm";
import jsPDF from "jspdf";

type Meeting = {
  title: string;
  date: string;
  notes: string;
  agenda?: string;
  protocol?: string;
};

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [loadingType, setLoadingType] = useState<"agenda" | "protocol" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("meetings");
    if (saved) setMeetings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("meetings", JSON.stringify(meetings));
  }, [meetings]);

  function addMeeting(m: Meeting) {
    setMeetings((prev) => [m, ...prev]);
  }

  async function handleAIRequest(index: number, type: "agenda" | "protocol") {
    const meeting = meetings[index];
    setLoadingIndex(index);
    setLoadingType(type);

    try {
      const res = await fetch(`/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: meeting.title,
          date: meeting.date,
          notes: meeting.notes,
          agenda: meeting.agenda,
        }),
      });

      const data = await res.json();

      if (data.agenda || data.protocol) {
        const updated = [...meetings];
        if (type === "agenda") updated[index].agenda = data.agenda;
        if (type === "protocol") updated[index].protocol = data.protocol;
        setMeetings(updated);
      } else {
        alert("Kunde inte generera AI-svar 😅");
      }
    } catch (err) {
      console.error(err);
      alert("Ett fel uppstod vid AI-generering!");
    } finally {
      setLoadingIndex(null);
      setLoadingType(null);
    }
  }

  function generateAgenda(i: number) {
    handleAIRequest(i, "agenda");
  }

  function generateProtocol(i: number) {
    handleAIRequest(i, "protocol");
  }

  function removeMeeting(i: number) {
    const confirmDelete = confirm("Är du säker på att du vill ta bort mötet?");
    if (!confirmDelete) return;
    setMeetings((prev) => prev.filter((_, idx) => idx !== i));
  }

  // 📄 Exportera PDF
  function downloadPDF(meeting: Meeting, type: "agenda" | "protocol") {
    const doc = new jsPDF();
    const title = type === "agenda" ? "Dagordning" : "Protokoll";
    const content = type === "agenda" ? meeting.agenda : meeting.protocol;

    if (!content) return alert(`Ingen ${title.toLowerCase()} finns att ladda ner.`);

    const formattedDate = new Date(meeting.date).toLocaleDateString("sv-SE");
    const fileName = `${meeting.title.replace(/\s+/g, "_")}_${title}_${formattedDate}.pdf`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${title}: ${meeting.title}`, 10, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Datum: ${formattedDate}`, 10, 30);

    const text = doc.splitTextToSize(content || "", 180);
    doc.text(text, 10, 45);

    doc.save(fileName);
  }

  // 🔗 Kopiera delningslänk
  function copyShareLink(meeting: Meeting) {
    const slug = meeting.title.toLowerCase().replace(/\s+/g, "-");
    const link = `${window.location.origin}/meetings/${slug}`;
    navigator.clipboard.writeText(link);
    alert("Delningslänk kopierad till urklipp ✅");
  }

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Möten</h1>

      <MeetingForm onAdd={addMeeting} />

      {meetings.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sparade möten</h2>

          <AnimatePresence>
            {meetings.map((m, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="border rounded p-4 bg-gray-50 space-y-2 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{m.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(m.date).toLocaleString("sv-SE")}
                    </p>
                  </div>

                  <button
                    onClick={() => removeMeeting(i)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Ta bort
                  </button>
                </div>

                {m.notes && <p className="text-sm mt-1 text-gray-700">{m.notes}</p>}

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => generateAgenda(i)}
                    disabled={loadingIndex === i && loadingType === "agenda"}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    {loadingIndex === i && loadingType === "agenda"
                      ? "Genererar..."
                      : "Generera dagordning 🤖"}
                  </button>

                  <button
                    onClick={() => generateProtocol(i)}
                    disabled={loadingIndex === i && loadingType === "protocol"}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                  >
                    {loadingIndex === i && loadingType === "protocol"
                      ? "Genererar..."
                      : "Generera protokoll 📋"}
                  </button>
                </div>

                {m.agenda && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-3 bg-white border rounded whitespace-pre-wrap text-sm"
                  >
                    <strong>AI-dagordning:</strong>
                    <br />
                    {m.agenda}
                    <div className="mt-2 flex justify-between items-center text-xs">
                      <button
                        onClick={() => downloadPDF(m, "agenda")}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Ladda ner dagordning som PDF
                      </button>

                      <button
                        onClick={() => copyShareLink(m)}
                        className="text-purple-600 hover:text-purple-800 underline"
                      >
                        Kopiera delningslänk 🔗
                      </button>
                    </div>
                  </motion.div>
                )}

                {m.protocol && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-3 bg-white border rounded whitespace-pre-wrap text-sm"
                  >
                    <strong>AI-protokoll:</strong>
                    <br />
                    {m.protocol}
                    <div className="mt-2 flex justify-between items-center text-xs">
                      <button
                        onClick={() => downloadPDF(m, "protocol")}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Ladda ner protokoll som PDF
                      </button>

                      <button
                        onClick={() => copyShareLink(m)}
                        className="text-purple-600 hover:text-purple-800 underline"
                      >
                        Kopiera delningslänk 🔗
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 italic"
        >
          Inga möten skapade ännu.
        </motion.div>
      )}
    </main>
  );
}
