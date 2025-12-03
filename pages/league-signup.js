import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function LeagueSignup() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    notes: "",
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Show message banner
  const showInfo = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
  };

  // Load leagues from WordPress
  useEffect(() => {
    async function loadLeagues() {
      try {
        const res = await fetch(`${API_BASE}/wp-json/teri/v5/leagues`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Bad league format");
        }

        // Only show active leagues with available slots
        const active = data.filter(
          (l) =>
            String(l.active) === "1" && Number(l.slots_available) > 0
        );

        setLeagues(active);
      } catch (err) {
        console.error("Failed to load leagues:", err);
        showInfo("Unable to load leagues.", "error");
      } finally {
        setLoading(false);
      }
    }

    loadLeagues();
  }, []);

  // Submit signup
  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedLeague) {
      showInfo("Please select a league.", "error");
      return;
    }

    try {
      const payload = {
        league_id: selectedLeague,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        email: form.email,
        notes: form.notes,
      };

      const res = await fetch(
        `${API_BASE}/wp-json/teri/v5/league/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!data.success) {
        console.error("Signup failed:", data);
        showInfo("Signup failed. Please try again.", "error");
        return;
      }

      // If Square returned a checkout URL, redirect
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
        return;
      }

      // Otherwise, show success message
      showInfo("Signup successful!", "success");

    } catch (err) {
      console.error("Signup error:", err);
      showInfo("Signup failed. Please try again.", "error");
    }
  }

  return (
    <div className="page-shell">
      <div className="max-w-5xl mx-auto py-16">
        <h1 className="text-center text-4xl font-bold text-amber-400 mb-10">
          League Signup
        </h1>

        {/* Message Box */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              messageType === "error"
                ? "bg-red-800/40 text-red-300"
                : messageType === "success"
                ? "bg-green-800/40 text-green-300"
                : "bg-slate-700/40 text-slate-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: League Selection */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-amber-400">
              Available Leagues
            </h2>

            {loading ? (
              <p className="text-slate-300">Loading leagues…</p>
            ) : leagues.length === 0 ? (
              <p className="text-slate-300">No open leagues at this time.</p>
            ) : (
              <div className="space-y-4">
                {leagues.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLeague(l.id)}
                    className={`w-full text-left p-5 rounded-xl border ${
                      selectedLeague === l.id
                        ? "border-amber-400 bg-amber-400/20"
                        : "border-slate-500/40 bg-slate-700/20"
                    } hover:border-amber-300 transition`}
                  >
                    <div className="font-semibold text-xl text-slate-100">
                      {l.name}
                    </div>
                    <div className="text-slate-300">
                      {l.day} @ {l.time}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {l.slots_available} open slots
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Signup Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-amber-400">
              Your Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="first_name"
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <input
                  name="last_name"
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="form-input"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
              />

              <textarea
                name="notes"
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={handleChange}
                className="form-input min-h-[120px]"
              />

              <button
                type="submit"
                className="btn-primary w-full mt-4"
              >
                Submit Signup
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
