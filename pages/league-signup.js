import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function LeagueSignup() {
  const router = useRouter();

  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [loadingLeagues, setLoadingLeagues] = useState(true);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [submitting, setSubmitting] = useState(false);

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------------------------------------------
  // LOAD LEAGUES
  // -------------------------------------------------------------
  useEffect(() => {
    async function loadLeagues() {
      try {
        const res = await fetch(
          `${API_BASE}/wp-json/teri/v5/leagues`
        );

        const data = await res.json();
        console.log("Loaded leagues:", data);

        if (!Array.isArray(data)) {
          throw new Error("Bad league format");
        }

        const active = data.filter(
          (l) =>
            String(l.active) === "1" &&
            Number(l.slots_available) > 0
        );

        setLeagues(active);
      } catch (err) {
        console.error("Failed to load leagues:", err);
        showMessage("Unable to load leagues. Please try again later.", "error");
      } finally {
        setLoadingLeagues(false);
      }
    }

    loadLeagues();
  }, []);

  // -------------------------------------------------------------
  // SUBMIT SIGNUP
  // -------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLeague) {
      showMessage("Please select a league.", "error");
      return;
    }

    setSubmitting(true);
    showMessage("");

    try {
      const res = await fetch(
        `${API_BASE}/wp-json/teri/v5/league/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            league_id: selectedLeague,
            first_name: form.first_name,
            last_name: form.last_name,
            phone: form.phone,
            email: form.email,
            notes: form.notes,
          }),
        }
      );

      const data = await res.json();
      console.log("Signup response:", data);

      // ❌ FAIL LOGIC
      if (!res.ok || !data.success) {
        showMessage("Signup failed. Please try again.", "error");
        return;
      }

      // 🎉 SUCCESS LOGIC
      showMessage("Signup successful!", "success");

      // If Square URL exists → redirect to payment
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
        return;
      }

      // Otherwise → go to thank-you page
      router.push("/thank-you");

    } catch (err) {
      console.error("Signup error:", err);
      showMessage("Signup failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="max-w-5xl mx-auto py-20 text-slate-100">
        <h1 className="text-4xl font-bold mb-8 text-center text-[var(--dew-gold)]">
          League Signup
        </h1>

        <p className="text-center mb-12 text-slate-300">
          Choose your league night and complete your info.  
          Payment is handled through Square.  
          Your spot is confirmed automatically.
        </p>

        {/* Message Banner */}
        {message && (
          <div
            className={`mb-8 p-4 text-center rounded-lg ${
              messageType === "error"
                ? "bg-red-800/70 text-red-200"
                : "bg-green-800/70 text-green-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* -------------------------------------------------------------
              LEFT SIDE — Leagues List
            ------------------------------------------------------------- */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--dew-gold)]">
              Available Leagues
            </h2>

            {loadingLeagues && (
              <p className="text-slate-400">Loading leagues…</p>
            )}

            {!loadingLeagues && leagues.length === 0 && (
              <p className="text-slate-400">No leagues available at the moment.</p>
            )}

            {leagues.map((l) => (
              <div
                key={l.id}
                className={`p-5 mb-4 rounded-xl cursor-pointer border shadow-md shadow-black/40 transition ${
                  selectedLeague === l.id
                    ? "border-[var(--dew-gold)] bg-slate-900/60"
                    : "border-slate-600/40 bg-slate-900/30 hover:bg-slate-900/50"
                }`}
                onClick={() => setSelectedLeague(l.id)}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      selectedLeague === l.id ? "bg-[var(--dew-gold)]" : "bg-slate-500"
                    }`}
                  ></div>
                  <h3 className="text-xl font-semibold">{l.name}</h3>
                </div>

                <p className="text-slate-300">{l.day} @ {l.time}</p>
                <p className="text-slate-400 text-sm mt-1">
                  {l.slots_available} open slots
                </p>
              </div>
            ))}
          </div>

          {/* -------------------------------------------------------------
              RIGHT SIDE — Signup Form
            ------------------------------------------------------------- */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--dew-gold)]">
              Your Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-sm text-slate-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded bg-slate-900/60 border border-slate-700 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-slate-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded bg-slate-900/60 border border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-300">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded bg-slate-900/60 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded bg-slate-900/60 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-300">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 rounded bg-slate-900/60 border border-slate-700 text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-lg font-semibold"
              >
                {submitting ? "Submitting…" : "Submit Signup"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
