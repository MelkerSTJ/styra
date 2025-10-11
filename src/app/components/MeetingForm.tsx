"use client";
import { useState } from "react";

type Meeting = {
  title: string;
  date: string;
  notes: string;
};

type Props = {
  onAdd: (meeting: Meeting) => void;
};

export default function MeetingForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !date) return alert("Titel och datum krävs!");
    onAdd({ title, date, notes });
    setTitle("");
    setDate("");
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-1">Titel</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded w-full p-2"
          placeholder="Ex: Styrelsemöte 15 oktober"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Datum</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Anteckningar</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border rounded w-full p-2"
          placeholder="Ex: Diskutera ekonomi och nya medlemmar..."
        />
      </div>

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
        Spara möte
      </button>
    </form>
  );
}
