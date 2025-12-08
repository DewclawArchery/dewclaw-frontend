import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

/**
 * League Signup Page – uses v6 API and real slot availability.
 *
 * - GET  /wp-json/teri/v6/leagues
 * - GET  /wp-json/teri/v6/leagues/{id}/signups  (paid signups only)
 * - POST /wp-json/teri/v6/leagues/{id}/signup
 */
export default function LeagueSignup() {
  const [leagues, setLeagues] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "info" | "error" | "success"
  const [loading, setLoading] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    notes: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const showMsg = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
  };

  // Load leagues + paid signup counts
  useEffect(() => {
    async function loadLeagues() {
      try {
        const res = await fetch(`${API_BASE}/wp-json/teri/v6/leagues`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error(`Leagues HTTP ${res.status}`);
        }

        const json = await res.json();

        if (!json.success || !Array.isArray(json.data)) {
          throw new Error("Bad league payload");
        }

        const baseLeagues = json.data;

        // For each league, fetch PAID signups and compute available slots
        const withSlots = await Promise.all(
          baseLeagues.map(async (league) => {
            let paidCount = 0;

            try {
              const res2 = await fetch(
                `${API_BASE}/wp-json/teri/v6/leagues/${league.id}/signups`,
                { method: "GET" }
              );

              if (res2.ok) {
                const json2 = await res2.json();
                if (json2.success && Array.isArray(json2.data)) {
                  paidCount = json2.data.length;
                }
              }
            } catch (err) {
              console.error("Failed to load signups for league", league.id, err);
            }

            const maxSlots = Number(league.max_slots ?? 0);
            const slotsAvailable = Math.max(0, maxSlots - paidCount);

            return {
              ...league,
              slots_available: slotsAvailable,
            };
          })
        );

        const active = withSlots.filter(
          (l) =>
            String(l.active) === "1" || l.active === true || l.active === 1
        );

        const open = active.filter((l) => Number(l.slots_available) > 0);

        setLeagues(open);
      } catch (err) {
        console.error("Failed to load leagues:", err);
        showMsg("Unable to load leagues at this time.", "error");
      }
    }

    loadLeagues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeague) {
      showMsg("Please select a league first.", "error");
      return;
    }

    // Basic frontend validation to match backend expectations
    if (!form.firstName.trim() || !form.lastName.trim()) {
      showMsg("Please enter your first and last name.", "error");
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      showMsg("Please enter a valid email address.", "error");
      return;
    }
    if (!form.phone.trim() || form.phone.trim().length < 7) {
      showMsg("Please enter a valid phone number.", "error");
      return;
    }

    setLoading(true);
    showMsg("");

    try {
      const payload = {
        participant_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        notes: form.notes.trim(),
        payment_mode: "online",
      };

      const res = await fetch(
        `${API_BASE}/wp-json/teri/v6/leagues/${selectedLeague}/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const out = await res.json();
      console.log("Signup response:", out);

      if (!out.success) {
        showMsg(
          out.message || "Signup failed. Please check your info and try again.",
          "error"
        );
        setLoading(false);
        return;
      }

      showMsg("Signup successful! You're all set.", "success");

      if (out.data && out.data.payment_link) {
        setTimeout(() => {
          window.location.href = out.data.payment_link;
        }, 700);
      }
    } catch (err) {
      console.error("Signup error:", err);
      showMsg("Signup failed. Please try again.", "error");
    }

    setLoading(false);
  };

  return (
    <div className="page-shell">
      <section className="max-w-6xl mx-auto py-16 px-4 md:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-dew-gold mb-4">
            League Signup
          </h1>
          <p className="text-slate-200 max-w-2xl mx-auto">
            Choose your league night and complete your info. Payment is handled
            through Square. Your spot is confirmed automatically.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT COLUMN — LEAGUE LIST */}
          <div>
            <h2 className="text-2xl font-semibold text-dew-gold mb-4">
              Available Leagues
            </h2>

            {leagues.length === 0 && (
              <p className="text-slate-400">Loading leagues…</p>
            )}

            <div className="space-y-4">
              {leagues.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLeague(l.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedLeague === l.id
                      ? "border-dew-gold bg-black/40"
                      : "border-slate-700/50 bg-black/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-100">
                        {l.name}
                      </p>
                      <p className="text-slate-400">
                        {l.day_of_week} @ {l.start_time}
                      </p>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {l.slots_available} open slots
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — SIGNUP FORM */}
          <div className="content-panel">
            <h2 className="text-2xl font-semibold text-dew-gold mb-4">
              Your Information
            </h2>

            {message && (
              <div
                className={`p-3 mb-4 rounded-lg ${
                  messageType === "error"
                    ? "bg-red-900/70 text-red-300"
                    : messageType === "success"
                    ? "bg-green-900/50 text-green-300"
                    : "bg-slate-800/70 text-slate-200"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-200 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="btn-primary disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Submitting…" : "Submit Signup"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-semibold text-dew-gold">
            How League Signup Works
          </h2>
          <p className="text-slate-200">
            1. Select your preferred league day/time.
          </p>
          <p className="text-slate-200">
            2. Enter your information and complete the Square checkout.
          </p>
          <p className="text-slate-200">
            3. Once payment clears, your spot is automatically confirmed.
          </p>
          <p className="text-slate-400 text-sm">
            Signing up multiple shooters? Be sure your day/time has enough open
            slots.
          </p>
        </div>
      </section>
    </div>
  );
}
