"use client";

import { useState } from "react";

export default function ProtocolPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [agenda, setAgenda] = useState("");
  const [notes, setNotes] = useState("");
  const [protocol, setProtocol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const generateProtocol = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/protocol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, agenda, notes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte generera protokoll");

      setProtocol(data.protocol);

      // 🔹 När protokollet skapats – spara mötet i databasen
      const saveRes = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          agenda,
          notes,
          protocol: data.protocol,
        }),
      });

      if (!saveRes.ok) throw new Error("Kunde inte spara mötet");
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ett okänt fel uppstod";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Generera protokoll automatiskt
      </h1>

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
          placeholder="Dagordning"
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 h-24"
        />

        <textarea
          placeholder="Anteckningar"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 h-24"
        />

        <button
          onClick={generateProtocol}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
        >
          {loading ? "Genererar..." : "Generera protokoll"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-center">
            ✅ Protokollet sparades i databasen!
          </p>
        )}

        {protocol && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg whitespace-pre-wrap">
            <h2 className="font-bold mb-2">Genererat protokoll</h2>
            <p>{protocol}</p>
          </div>
        )}
      </div>
    </div>
  );
}
