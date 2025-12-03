import { useEffect, useState } from "react";
import Head from "next/head";

const API_BASE =
  process.env.NEXT_PUBLIC_TERI_API_BASE || "https://dewclawarchery.com";

export default function LeagueSignup() {
  const [leagues, setLeagues] = useState([]);
  const [loadingLeagues, setLoadingLeagues] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    leagueId: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const showError = (msg) => {
    setMessage(msg);
    setMessageType("error");
  };

  const showInfo = (msg) => {
    setMessage(msg);
    setMessageType("info");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Load leagues from T.E.R.I.
  useEffect(() => {
    async function loadLeagues() {
      try {
        const res = await fetch(`${API_BASE}/wp-json/teri/v5/leagues`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Bad league format");
        }

        // Only show ACTIVE leagues with OPEN slots
        const activeLeagues = data.filter(
          (l) =>
            String(l.active) === "1" &&
            Number(l.slots_available) > 0
        );

        setLeagues(activeLeagues);
      } catch (err) {
        console.error("Failed to load leagues:", err);
      } finally {
        setLoadingLeagues(false);
      }
    }

    loadLeagues();
  }, []);

  // Submit signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { firstName, lastName, email, phone, leagueId, notes } = form;

    if (!firstName.trim() || !lastName.trim()) {
      return showError("Please enter your first and last name.");
    }
    if (!email.includes("@")) {
      return showError("Please enter a valid email address.");
    }
    if (!phone.trim() || phone.length < 7) {
      return showError("Please enter a valid phone number.");
    }
    if (!leagueId) {
      return showError("Please select a league.");
    }

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      league_id: leagueId,
      notes: notes.trim(),
    };

    try {
      setSubmitting(true);
      showInfo("Submitting signup…");

      const res = await fetch(`${API_BASE}/wp-json/teri/v5/league/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success || !data.checkout_url) {
        return showError(
          data?.message || "Signup failed. Please try again."
        );
      }

      // redirect to Square
      window.location.href = data.checkout_url;
    } catch (err) {
      console.error(err);
      return showError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>League Signup | Dewclaw Archery</title>
        <meta
          name="description"
          content="Sign up for Dewclaw Archery leagues. Choose your league night and secure your spot with Square."
        />
      </Head>

      <section className="max-w-6xl mx-auto py-16 px-4 md:px-6 lg:px-8">
        {/* Page Header */}
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
          {/* Left: Available Leagues */}
          <div>
            <h2 className="text-2xl font-semibold text-dew-gold mb-4">
              Available Leagues
            </h2>

            {loadingLeagues ? (
              <p className="text-slate-400">Loading leagues…</p>
            ) : leagues.length === 0 ? (
              <p className="text-slate-400">
                No active leagues with open slots right now.
              </p>
            ) : (
              <ul className="space-y-4">
                {leagues.map((league) => (
                  <li
                    key={league.id}
                    className="p-4 rounded-lg bg-slate-900/60 border border-slate-700/40"
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="leagueId"
                        value={league.id}
                        checked={form.leagueId == league.id}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-dew-gold focus:ring-dew-gold"
                      />

                      <div>
                        <p className="text-lg font-semibold text-dew-gold">
                          {league.name}
                        </p>
                        <p className="text-slate-200">
                          {league.day} @ {league.time}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                          {league.slots_available} open slots
                        </p>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right: Signup Form */}
          <div className="content-panel">
            <h2 className="text-2xl font-semibold text-dew-gold mb-4">
              Your Information
            </h2>

            {message && (
              <div
                className={`mb-4 rounded-md px-4 py-3 text-sm ${
                  messageType === "error"
                    ? "bg-red-900/50 text-red-100 border border-red-500/40"
                    : "bg-slate-900/60 text-slate-100 border border-slate-500/40"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-dew-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-dew-gold"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-dew-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-dew-gold"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-dew-gold"
                />
              </div>

              {/* Submit */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : "Submit Signup"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* How It Works */}
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
            3. Once payment clears, your slot is automatically confirmed.
          </p>

          <p className="text-slate-400 text-sm mt-4">
            Signing up multiple shooters? Be sure your chosen day/time has
            enough open slots so your group can shoot together.
          </p>
        </div>
      </section>
    </>
  );
}
