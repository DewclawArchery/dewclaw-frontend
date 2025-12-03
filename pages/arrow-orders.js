import { useState } from "react";
import Head from "next/head";

const API_BASE =
  process.env.NEXT_PUBLIC_TERI_API_BASE || "https://dewclawarchery.com";

export default function ArrowOrders() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    arrowModel: "",
    spine: "",
    fletchingColors: "",
    wrap: "no",
    wrapColor: "",
    cutLength: "",
    quantity: "12",
    verifyPrevious: "no",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "info" | "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showError = (msg) => {
    setMessage(msg);
    setMessageType("error");
  };

  const showInfo = (msg) => {
    setMessage(msg);
    setMessageType("info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("info");

    const {
      firstName,
      lastName,
      phone,
      email,
      arrowModel,
      spine,
      fletchingColors,
      wrap,
      wrapColor,
      cutLength,
      quantity,
      verifyPrevious,
      notes,
    } = form;

    // Basic validation similar to plugin intent
    if (!firstName.trim() || !lastName.trim()) {
      return showError("Please enter your first and last name.");
    }
    if (!phone.trim() || phone.trim().length < 7) {
      return showError("Please enter a valid phone number.");
    }
    if (!email.trim() || !email.includes("@")) {
      return showError("Please enter a valid email address.");
    }
    if (!arrowModel.trim()) {
      return showError("Please enter an arrow model.");
    }
    if (!spine.trim()) {
      return showError("Please enter a spine value.");
    }
    if (!fletchingColors.trim()) {
      return showError("Please enter fletching colors.");
    }
    if (!wrap) {
      return showError("Please select whether you want a wrap.");
    }

    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum < 6) {
      return showError("Quantity must be at least 6, in multiples of 6.");
    }
    if (qtyNum % 6 !== 0) {
      return showError("Quantity must be in multiples of 6 (6, 12, 18, …).");
    }
    if (!verifyPrevious) {
      return showError(
        "Please indicate if we should verify a previous build."
      );
    }

    // Build payload as backend expects
    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim(),
      spec: {
        arrow_model: arrowModel.trim(),
        spine: spine.trim(),
        fletching_colors: fletchingColors.trim(),
        wrap,
        wrap_color: wrapColor.trim(),
        cut_length: cutLength.trim(),
        quantity: qtyNum,
        verify_previous: verifyPrevious,
        notes: notes.trim(),
      },
    };

    try {
      setSubmitting(true);
      showInfo("Submitting your order…");

      const res = await fetch(`${API_BASE}/wp-json/teri/v5/order/arrow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success || !data.redirect_url) {
        console.error("Arrow order error:", data);
        return showError(
          data?.message ||
            "Something went wrong submitting your order. Please try again or contact the shop."
        );
      }

      // Success: redirect to Square deposit link
      window.location.href = data.redirect_url;
    } catch (err) {
      console.error(err);
      showError(
        "Unexpected error while submitting your order. Please try again or contact the shop."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Custom Arrow Orders | Dewclaw Archery</title>
        <meta
          name="description"
          content="Order fully custom arrows built around your bow, draw cycle, and goals. Submit your specs and lock in your build with a Square deposit."
        />
      </Head>

      <section className="max-w-6xl mx-auto py-16 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-dew-gold mb-4">
            Custom Arrow Orders
          </h1>
          <p className="text-slate-200 max-w-2xl mx-auto">
            Custom arrows built around your bow, your draw cycle, and your
            goals. Tell us how you shoot and what you&apos;re preparing for, and
            T.E.R.I. routes your build into our system. We&apos;ll review the
            details and send a Square deposit link to lock in your build.
          </p>
        </header>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info / helper copy */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-dew-gold">
              How this works
            </h2>
            <p className="text-slate-200 leading-relaxed">
              Fill out the form with your bow and arrow details. The more you
              can tell us about your setup and how you shoot, the better we can
              match the build to what you&apos;re doing—whether that&apos;s
              broadhead-tuned hunting arrows, durable practice arrows, or a
              dedicated target setup.
            </p>

            <ul className="space-y-2 text-slate-200 text-sm">
              <li>• Quantity in multiples of 6 (6, 12, 18, …).</li>
              <li>• You can request we verify a previous build if we&apos;ve built for you before.</li>
              <li>• We&apos;ll contact you if anything needs clarification.</li>
            </ul>

            <p className="text-slate-400 text-sm">
              This form starts the process; your spot is locked in once your
              Square deposit is completed.
            </p>
          </div>

          {/* Right: Form */}
          <div className="content-panel">
            <h2 className="text-2xl font-semibold text-dew-gold mb-4">
              Arrow Build Details
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
              {/* Name / Contact */}
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
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                    autoComplete="given-name"
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
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                    autoComplete="family-name"
                  />
                </div>
              </div>

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
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                    autoComplete="tel"
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
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Arrow core specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Arrow Model
                  </label>
                  <input
                    type="text"
                    name="arrowModel"
                    value={form.arrowModel}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                    placeholder="e.g. Easton Axis 5mm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Spine
                  </label>
                  <input
                    type="text"
                    name="spine"
                    value={form.spine}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                    placeholder="e.g. 300, 340, 400"
                  />
                </div>
              </div>

              {/* Fletching / Wrap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Fletching Colors
                  </label>
                  <input
                    type="text"
                    name="fletchingColors"
                    value={form.fletchingColors}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                    placeholder="e.g. 2 white, 1 green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Wrap?
                  </label>
                  <select
                    name="wrap"
                    value={form.wrap}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                  >
                    <option value="no">No wrap</option>
                    <option value="yes">Yes, add a wrap</option>
                  </select>
                </div>
              </div>

              {form.wrap === "yes" && (
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Wrap Color / Notes
                  </label>
                  <input
                    type="text"
                    name="wrapColor"
                    value={form.wrapColor}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                    placeholder="e.g. solid white, orange with logo, etc."
                  />
                </div>
              )}

              {/* Cut length / quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Cut Length (inches)
                  </label>
                  <input
                    type="text"
                    name="cutLength"
                    value={form.cutLength}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                    placeholder="e.g. 27.5&quot; from throat of nock"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    If you&apos;re unsure, describe how you measure or note
                    &quot;same as previous&quot; and we&apos;ll verify.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Quantity (multiples of 6)
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="6"
                    step="6"
                    value={form.quantity}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                  />
                </div>
              </div>

              {/* Verify previous build */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Verify Previous Build?
                </label>
                <select
                  name="verifyPrevious"
                  value={form.verifyPrevious}
                  onChange={handleChange}
                  className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                >
                  <option value="no">No, this is a new build</option>
                  <option value="yes">
                    Yes, verify against a previous Dewclaw build
                  </option>
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  If you&apos;ve had arrows built here before, we can cross-check
                  this order with your previous specs.
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Notes / How You Shoot
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md bg-slate-900/80 border border-slate-600/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-dew-gold"
                  placeholder="Tell us about your bow, draw weight, what you’re hunting or training for, and anything else that matters."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : "Submit Arrow Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
