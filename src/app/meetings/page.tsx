"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, FileText, Plus } from "lucide-react";


interface Meeting {
  id: string;
  title: string;
  date: string;
  protocol: string | null;
  createdAt: string;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchMeetings() {
      const res = await fetch("/api/meetings");
      const data = await res.json();
      setMeetings(data);
    }
    fetchMeetings();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🌈 Bakgrund */}
      <div
        className="absolute inset-0 transition-colors duration-700 
        bg-gradient-to-b from-[#f7f9fc] via-[#f8f8fb] to-[#eef1f5]
        dark:from-[#0a0e16] dark:via-[#0e121d] dark:to-[#111827]"
      />

      {/* Innehåll */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-20 pb-24 px-6 max-w-6xl mx-auto">
        {/* Titel */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-10">
          <h1
            className="text-3xl sm:text-4xl font-bold text-center sm:text-left
            bg-gradient-to-r from-indigo-700 to-slate-600 dark:from-blue-400 dark:to-slate-300
            text-transparent bg-clip-text tracking-tight"
          >
            Dina möten
          </h1>
        </div>

        {/* Möteskort */}
        <div
          className="w-full p-10 rounded-3xl shadow-xl
          bg-white/80 dark:bg-[#111827]/70
          backdrop-blur-md border border-gray-200 dark:border-gray-700
          transition-all duration-500"
        >
          {meetings.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300">
              Inga möten skapade ännu.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {meetings.map((meeting, i) => (
                <div
                  key={meeting.id}
                  onClick={() => router.push(`/meetings/${meeting.id}`)}
                  className={`p-6 rounded-2xl border cursor-pointer
                    bg-white dark:bg-[#1a1f2e] border-gray-200 dark:border-gray-700
                    hover:shadow-lg hover:-translate-y-1 hover:border-indigo-400 
                    dark:hover:border-blue-500 transition-all duration-300
                    ${i === 0 ? "scale-[1.02]" : ""}`}
                >
                  <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {meeting.title}
                  </h2>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Calendar className="w-4 h-4 mr-2 opacity-70" />
                    {new Date(meeting.date).toLocaleDateString("sv-SE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="w-4 h-4 mr-2 opacity-70" />
                    {meeting.protocol ? "Protokoll genererat" : "Protokoll saknas"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✨ Flytande knapp */}
      <div
        className="fixed bottom-8 right-8 z-50"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          onClick={() => router.push("/meetings/new")}
          className={`flex items-center justify-center overflow-hidden
            shadow-lg font-medium text-white
            bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400
            dark:shadow-[0_0_12px_rgba(30,64,175,0.6)]
            transition-all duration-300 ease-in-out
            ${hovered ? "w-52 rounded-full px-5" : "w-14 rounded-full"}
            h-14 relative group`}
        >
          {/* Plus-ikon */}
          <div
            className={`flex items-center justify-center transition-all duration-500 ${
              hovered ? "mr-3 scale-100" : "scale-100"
            }`}
          >
            <Plus
              className={`w-6 h-6 transition-all duration-500 
                text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]
                ${hovered ? "opacity-100" : "opacity-100"}
              `}
            />
          </div>

          {/* Text */}
          <span
            className={`transition-all duration-300 text-sm font-medium whitespace-nowrap ${
              hovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4 pointer-events-none"
            }`}
          >
            Skapa nytt möte
          </span>

          {/* Inner glow-effekt */}
          <span
            className="absolute inset-0 rounded-full 
            bg-gradient-to-r from-indigo-400/30 to-blue-400/30 
            opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
          ></span>
        </button>
      </div>
    </div>
  );
}
