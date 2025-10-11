"use client";
import { useState } from "react";
import jsPDF from "jspdf";

export default function ProtocolPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [agenda, setAgenda] = useState("");
  const [notes, setNotes] = useState("");
  const [protocol, setProtocol] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generateProtocol = async () => {
    setLoading(true);
    setError("");
    setProtocol("");
    setSummary("");

    try {
      const res = await fetch("/api/protocol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, agenda, notes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte generera protokoll");
      setProtocol(data.protocol);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Ett fel uppstod.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!protocol) return;
    await navigator.clipboard.writeText(protocol);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!protocol) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const maxWidth = 515;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    doc.text(protocol, margin, margin, { maxWidth, lineHeightFactor: 1.5 });

    const filename = title
      ? `${title.replace(/\s+/g, "_")}_protokoll.pdf`
      : "moteva_protokoll.pdf";

    doc.save(filename);
  };

  const handleSummarize = async () => {
    if (!protocol) return;
    setSummarizing(true);
    setSummary("");
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ protocol }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte sammanfatta protokoll");
      setSummary(data.summary);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Ett fel uppstod.");
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Generera protokoll automatiskt</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Mötets titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-800"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-800"
        />
        <textarea
          placeholder="Dagordning (valfritt)"
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          className="w-full h-24 rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-800"
        />
        <textarea
          placeholder="Anteckningar från mötet"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-32 rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-800"
        />

        <button
          onClick={generateProtocol}
          disabled={loading}
          className="w-full bg-[var(--moteva-blue)] text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Genererar..." : "Generera protokoll"}
        </button>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>

      {protocol && (
        <div className="mt-10 bg-[var(--moteva-surface)] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Genererat protokoll</h2>
          <pre className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-100">
            {protocol}
          </pre>

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={handleCopy}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {copied ? "✅ Kopierat!" : "📋 Kopiera text"}
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex-1 bg-[var(--moteva-blue)] text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              📄 Ladda ner som PDF
            </button>

            <button
              onClick={handleSummarize}
              disabled={summarizing}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {summarizing ? "🧠 Sammanfattar..." : "🧠 Sammanfatta mötet"}
            </button>
          </div>
        </div>
      )}

      {summary && (
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-3 text-green-700 dark:text-green-400">
            Sammanfattning
          </h3>
          <pre className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-100">
            {summary}
          </pre>
        </div>
      )}
    </div>
  );
}
