"use client";

import { useState } from "react";

export default function TechnoHuntBookingForm({ selectedSlot, onBooked }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    payment_mode: "shop",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_TERI_API_BASE || "https://dewclawarchery.com";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      setMsg("Please select a time slot.");
      return;
    }

    setLoading(true);
    setMsg("");

    const payload = {
      start: selectedSlot.start,
      name: form.name,
      email: form.email,
      phone: form.phone,
      notes: form.notes,
      payment_mode: form.payment_mode,
    };

    try {
      const res = await fetch(`${API_BASE}/wp-json/teri/v6/technohunt/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) {
        setMsg(json.message || "Error creating booking.");
        setLoading(false);
        return;
      }

      setMsg("Booking successful!");
      onBooked(json);
    } catch (err) {
      console.error(err);
      setMsg("Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/40 p-6 rounded-md border border-slate-700">
      <h2 className="text-xl font-semibold text-dew-gold">Book Your Lane</h2>

      {msg && <p className="text-slate-200">{msg}</p>}

      <input
        type="text"
        name="name"
        className="dew-input"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        className="dew-input"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        className="dew-input"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />

      <textarea
        name="notes"
        className="dew-input"
        rows={3}
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={handleChange}
      ></textarea>

      <label className="dew-label">Payment Method</label>
      <select
        name="payment_mode"
        value={form.payment_mode}
        className="dew-input"
        onChange={handleChange}
      >
        <option value="shop">Pay at Shop</option>
        <option value="online">Pay Online</option>
      </select>

      <button type="submit" disabled={loading} className="dew-button w-full">
        {loading ? "Booking..." : "Book Now"}
      </button>
    </form>
  );
}
