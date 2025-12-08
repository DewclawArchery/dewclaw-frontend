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
  const [messageType, setMessageType] = useState("info"); // "info" | "error" | "success"

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

  const showSuccess = (msg) => {
    setMessage(msg);
    setMessageType("success");
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

    // Basic validation similar to backend validator
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

      const res = await fetch(`${API_BASE}/wp-json/teri/v6/arrow/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        console.error("Arrow order error:", data);
        return showError(
          data?.message ||
            "Something went wrong submitting your order. Please try again or contact the shop."
        );
      }

      showSuccess(
        data.message ||
          "Your arrow order has been received. We'll review the details and follow up if anything needs clarification."
      );

      // Optionally clear the form
      setForm({
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
          content="Order fully custom arrows built around your bow, draw cycle, and goals. Submit your specs and our team will review your build and follow up with next steps."
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
            T.E.R.I. routes your build into our system so the range can review
            and follow up with you.
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
              <li>
                • You can request we verify a previous build if we&apos;ve built
                for you before.
              </li>
              <li>• We&apos;ll contact you if anything needs clarification.</li>
            </ul>

            <p className="text-slate-400 text-sm">
              This form starts the process; the shop will follow up with pricing
              and payment details.
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
                    : messageType === "success"
                    ? "bg-emerald-900/40 text-emerald-100 border border-emerald-500/40"
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
                    className="dew-input"
                    required
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
                    className="dew-input"
                    required
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
                    className="dew-input"
                    required
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
                    className="dew-input"
                    required
                  />
                </div>
              </div>

              {/* Arrow details */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Arrow Model
                </label>
                <input
                  type="text"
                  name="arrowModel"
                  value={form.arrowModel}
                  onChange={handleChange}
                  className="dew-input"
                  placeholder="e.g. Axis 5mm, RIP TKO, Gold Tip Hunter Pro…"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Spine
                  </label>
                  <input
                    type="text"
                    name="spine"
                    value={form.spine}
                    onChange={handleChange}
                    className="dew-input"
                    placeholder="e.g. 250, 300, 340…"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Quantity (multiples of 6)
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    className="dew-input"
                    min={6}
                    step={6}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Fletching Colors
                </label>
                <input
                  type="text"
                  name="fletchingColors"
                  value={form.fletchingColors}
                  onChange={handleChange}
                  className="dew-input"
                  placeholder="e.g. 2x white, 1x chartreuse"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Wrap
                  </label>
                  <select
                    name="wrap"
                    value={form.wrap}
                    onChange={handleChange}
                    className="dew-input"
                    required
                  >
                    <option value="no">No wrap</option>
                    <option value="yes">Yes, add wrap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Wrap Color / Style
                  </label>
                  <input
                    type="text"
                    name="wrapColor"
                    value={form.wrapColor}
                    onChange={handleChange}
                    className="dew-input"
                    placeholder="If wrap is yes, describe color or style"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Cut Length (if known)
                </label>
                <input
                  type="text"
                  name="cutLength"
                  value={form.cutLength}
                  onChange={handleChange}
                  className="dew-input"
                  placeholder='e.g. "28.5&quot; carbon-to-carbon"'
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Verify Previous Build?
                </label>
                <select
                  name="verifyPrevious"
                  value={form.verifyPrevious}
                  onChange={handleChange}
                  className="dew-input"
                  required
                >
                  <option value="no">No, this is a new setup</option>
                  <option value="yes">Yes, verify my previous build</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Notes / Bow Details / Goals
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="dew-input min-h-[120px]"
                  placeholder="Tell us about your bow, draw weight/length, what broadheads you shoot, and what you want this build to do."
                />
              </div>

              <button
                type="submit"
                className="dew-button w-full sm:w-auto"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit Arrow Order"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
