import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

/**
 * League Signup Page – Option A (Always succeed)
 */
export default function LeagueSignup() {
  const [leagues, setLeagues] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    notes: "",
  });

  // Helper: update form fields
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Helper: UI message
  const showMsg = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
  };

  // Load leagues from the plugin
  useEffect(() => {
    async function loadLeagues() {
      try {
        const res = await fetch(`${API_BASE}/wp-json/teri/v5/leagues`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Bad league format");
        }

        // Only show ACTIVE leagues with OPEN slots
        const active = data.filter(
          (l) => String(l.active) === "1" && Number(l.slots_available) > 0
        );

        setLeagues(active);
      } catch (err) {
        console.error("Failed to load leagues:", err);
        showMsg("Unable to load leagues at this time.", "error");
      }
    }

    loadLeagues();
  }, []);

  // Submit signup handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeague) {
      showMsg("Please select a league first.", "error");
      return;
    }

    setLoading(true);
    showMsg("");

    try {
      const payload = {
        league_id: selectedLeague,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        email: form.email,
        notes: form.notes,
      };

      const res = await fetch(`${API_BASE}/wp-json/teri/v5/league/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const out = await res.json();
      console.log("Signup response:", out);

      if (!out.success) {
        showMsg("Signup failed. Please try again.", "error");
        setLoading(false);
        return;
      }

      // SUCCESS — always in Option A
      showMsg("Signup successful! You're all set.", "success");

      // Optional: redirect if Square gave us a link
      if (out.redirect_url && out.redirect_url.length > 5) {
        setTimeout(() => {
          window.location.href = out.redirect_url;
        }, 600);
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
                        {l.day} @ {l.time}
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
                    : "bg-green-900/50 text-green-300"
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
                  rows="4"
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

        {/* FOOTER INFO SECTION */}
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
