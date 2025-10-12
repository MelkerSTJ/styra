"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Meeting = {
  id: string;
  title: string;
  date: string;
  createdAt: string;
};

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch("/api/meetings");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Kunde inte hämta möten");

        setMeetings(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Ett okänt fel uppstod";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  if (loading)
    return (
      <div className="text-center py-12 text-gray-500">Laddar möten...</div>
    );

  if (error)
    return (
      <div className="text-center py-12 text-red-500">
        Fel: {error}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Mina möten</h1>

      {meetings.length === 0 ? (
        <p className="text-center text-gray-500">
          Du har inga sparade möten ännu.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2">{meeting.title}</h2>
              <p className="text-gray-500 mb-4">
                {new Date(meeting.date).toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="flex justify-between items-center">
                <Link
                  href={`/meetings/${meeting.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Visa protokoll
                </Link>

                <span className="text-sm text-gray-400">
                  Skapad {new Date(meeting.createdAt).toLocaleDateString("sv-SE")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
