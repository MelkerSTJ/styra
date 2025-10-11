"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

type Meeting = {
  title: string;
  date: string;
  notes: string;
  agenda?: string;
  protocol?: string;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/\s+/g, "-");
}

export default function SharedMeetingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [meeting, setMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("meetings");
    if (saved) {
      const meetings: Meeting[] = JSON.parse(saved);
      const found = meetings.find((m) => slugify(m.title) === slug);
      if (found) setMeeting(found);
    }
  }, [slug]);

  if (!meeting)
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Inget möte hittades 😅</p>
      </div>
    );

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-4">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center"
      >
        {meeting.title}
      </motion.h1>

      <p className="text-center text-gray-600">
        {new Date(meeting.date).toLocaleString("sv-SE")}
      </p>

      {meeting.agenda && (
        <section className="border rounded p-4 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Dagordning</h2>
          <pre className="whitespace-pre-wrap text-sm">{meeting.agenda}</pre>
        </section>
      )}

      {meeting.protocol && (
        <section className="border rounded p-4 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Protokoll</h2>
          <pre className="whitespace-pre-wrap text-sm">{meeting.protocol}</pre>
        </section>
      )}
    </main>
  );
}
