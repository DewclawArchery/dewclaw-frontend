"use client";

import { useState, useEffect } from "react";

export default function TechnoHuntCalendar({ onSelectSlot }) {
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_TERI_API_BASE || "https://dewclawarchery.com";

  useEffect(() => {
    async function loadSlots() {
      setLoading(true);

      try {
        const res = await fetch(
          `${API_BASE}/wp-json/teri/v6/technohunt/availability?date=${date}`
        );

        const json = await res.json();

        if (json.success) {
          setSlots(json.data);
        } else {
          setSlots([]);
        }
      } catch (err) {
        console.error("TechnoHunt availability error:", err);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    }

    loadSlots();
  }, [date]);

  return (
    <div>
      <label className="block font-semibold text-dew-gold mb-2">
        Select Date
      </label>
      <input
        type="date"
        className="dew-input mb-6"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {loading && <p className="text-slate-300">Loading availability…</p>}

      {!loading && (
        <div className="grid grid-cols-1 gap-3">
          {slots.length === 0 && (
            <p className="text-slate-300">No time slots for this date.</p>
          )}

          {slots.map((slot, i) => {
            const timeLabel = new Date(slot.start).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            });

            return (
              <button
                key={i}
                disabled={!slot.available}
                onClick={() => onSelectSlot(slot)}
                className={`dew-button justify-start ${
                  slot.available
                    ? "bg-green-800 hover:bg-green-700"
                    : "bg-slate-700 opacity-50 cursor-not-allowed"
                }`}
              >
                {timeLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
