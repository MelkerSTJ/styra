"use client";

import { useEffect, useMemo, useState } from "react";
import MeetingsHeader from "@/app/components/meetings/MeetingsHeader";
import FilterBar from "@/app/components/meeting/FilterBar";
import SearchInput from "@/app/components/meeting/SearchInput";
import MeetingCard from "@/app/components/meeting/MeetingCard";
import EmptyState from "@/app/components/meetings/EmptyState";

type FilterKey = "ALL" | "UPCOMING" | "ENDED" | "NOPROTOCOL";

interface Meeting {
  id: string;
  title: string;
  date: string;
  protocol: string | null;
  createdAt: string;
  status?: string | null; // "avslutat" eller null
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    async function fetchMeetings() {
      try {
        const res = await fetch("/api/meetings");
        const data = await res.json();
        if (!mounted) return;
        setMeetings(data);
      } catch (e) {
        // TODO: ev. toast
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchMeetings();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter + sök
  const filtered = useMemo(() => {
    const today = new Date();
    const normalizedSearch = search.trim().toLowerCase();

    return meetings
      .filter((m) => {
        // sök
        if (normalizedSearch.length) {
          const hay = `${m.title} ${new Date(m.date).toLocaleDateString("sv-SE")}`.toLowerCase();
          if (!hay.includes(normalizedSearch)) return false;
        }

        // filter
        if (filter === "ALL") return true;

        const dateObj = new Date(m.date);
        const isUpcoming = m.status !== "avslutat" && dateObj >= new Date(today.toDateString());
        const isEnded = m.status === "avslutat" || dateObj < new Date(today.toDateString());
        const noProtocol = !m.protocol;

        if (filter === "UPCOMING") return isUpcoming;
        if (filter === "ENDED") return isEnded;
        if (filter === "NOPROTOCOL") return noProtocol;

        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [meetings, filter, search]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Bakgrund */}
      <div
        className="absolute inset-0 transition-colors duration-700 
        bg-gradient-to-b from-[#f7f9fc] via-[#f8f8fb] to-[#eef1f5]
        dark:from-[#0a0e16] dark:via-[#0e121d] dark:to-[#111827]"
      />

      {/* Innehåll */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-20 pb-24 px-6 max-w-6xl mx-auto w-full">
        {/* Header med CTA */}
        <MeetingsHeader title="Dina möten" />

        {/* Filterbar + count i baren */}
        <div className="w-full mt-6">
          <FilterBar active={filter} onChange={setFilter} totalCount={filtered.length} />
        </div>

        {/* Sökfält */}
        <div className="w-full mt-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Sök möte..." />
        </div>

        {/* Wrapper-kort */}
        <div
          className="w-full mt-8 p-8 md:p-10 rounded-3xl shadow-xl
          bg-white/80 dark:bg-[#111827]/70 backdrop-blur-md
          border border-gray-200 dark:border-gray-700 transition-all duration-500"
        >
          {/* Loading skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl border border-gray-200 dark:border-gray-700
                  bg-gray-100/60 dark:bg-slate-800/40 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {filtered.map((m) => (
                <MeetingCard
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  date={m.date}
                  hasProtocol={!!m.protocol}
                  status={m.status || null}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
