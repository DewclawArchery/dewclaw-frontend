// pages/league-signup.js

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../lib/api";

export default function LeagueSignupPage() {
  const [leagues, setLeagues] = useState([]);
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [leagueError, setLeagueError] = useState(null);

  const [selectedLeague, setSelectedLeague] = useState(null);
  const [form, setForm] = useState({
    participant: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [submitError, setSubmitError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // -----------------------------
  // Load leagues on page load
  // -----------------------------
  useEffect(() => {
    async function loadLeagues() {
      try {
        const data = await apiGet(
          "https://dewclawarchery.com/wp-json/teri/v6/leagues"
        );

        // Only show leagues that are active and valid
        const active = data.filter((l) => l.active);
        setLeagues(active);
      } catch (err) {
        console.error("League load failed:", err);
        setLeagueError("Unable to load leagues at this time.");
      } finally {
        setLoadingLeagues(false);
      }
    }

    loadLeagues();
  }, []);

  // -----------------------------
  // Form Change Handler
  // -----------------------------
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // -----------------------------
  // Submit Signup
  // -----------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitLoading(true);

    try {
      if (!selectedLeague) {
        setSubmitError("Please select a league.");
        setSubmitLoading(false);
        return;
      }

      const payload = {
        league_id: selectedLeague.id,
        participant: form.participant,
        email: form.email,
        phone: form.phone,
        notes: form.notes,
        payment_mode: "online",
      };

      const result = await apiPost(
        "https://dewclawarchery.com/wp-json/teri/v6/league-signups",
        payload
      );

      // Redirect to thank-you page
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
        return;
      }
    } catch (err) {
      console.error("Signup error:", err);
      setSubmitError("There was a problem submitting your signup.");
    } finally {
      setSubmitLoading(false);
    }
  }

  // -----------------------------
  // Render UI
  // -----------------------------
  return (
    <div className="league-signup-page">

      <section className="hero">
        <h1>League Signup</h1>
        <p>
          Choose your league night and complete your info. Payments are handled through
          Square, and your spot will be confirmed automatically.
        </p>
      </section>

      <div className="signup-wrapper">

        {/* ------------------- LEFT SIDE: LEAGUE LIST ------------------- */}
        <div className="league-list">
          <h2>Available Leagues</h2>

          {loadingLeagues && <p>Loading leagues...</p>}

          {leagueError && (
            <p className="error">{leagueError}</p>
          )}

          {!loadingLeagues && leagues.length === 0 && (
            <p>No leagues available at this time.</p>
          )}

          {leagues.map((league) => (
            <button
              key={league.id}
              className={`league-option ${
                selectedLeague?.id === league.id ? "selected" : ""
              }`}
              onClick={() => setSelectedLeague(league)}
            >
              <strong>{league.name}</strong><br />
              {league.day_of_week} @ {league.start_time}<br />
              ${league.price} • {league.weeks} weeks
            </button>
          ))}
        </div>

        {/* ------------------- RIGHT SIDE: FORM ------------------- */}
        <div className="signup-form">
          <h2>Your Information</h2>

          {submitError && <p className="error">{submitError}</p>}

          <form onSubmit={handleSubmit}>

            <label>First & Last Name</label>
            <input
              name="participant"
              value={form.participant}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <label>Notes (optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />

            <button type="submit" disabled={submitLoading}>
              {submitLoading ? "Submitting..." : "Complete Signup"}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .error {
          background: #8b1e1e;
          color: white;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 15px;
        }
        .league-option {
          display: block;
          padding: 12px;
          margin: 8px 0;
          border: 1px solid #666;
          border-radius: 5px;
          cursor: pointer;
          text-align: left;
        }
        .league-option.selected {
          background: #fbbf24;
          border-color: #f59e0b;
        }
      `}</style>
    </div>
  );
}
