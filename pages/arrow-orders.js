import { useState, useEffect } from "react";
import Head from "next/head";
import PricingTable from "../components/PricingTable";

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
  const [messageType, setMessageType] = useState("info");

  // Pricing for live estimate
  const [pricingMap, setPricingMap] = useState({});
  const [pricingLoaded, setPricingLoaded] = useState(false);
  const [pricingError, setPricingError] = useState("");

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await fetch(
          `${API_BASE}/wp-json/teri/v6/pricing?category=arrows`
        );
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Unable to load arrow pricing.");
        }

        const map = {};
        (json.data || []).forEach((item) => {
          if (item.code) {
            map[item.code] = item;
          }
        });

        setPricingMap(map);
        setPricingLoaded(true);
      } catch (err) {
        console.error("Arrow pricing error:", err);
        setPricingError(err.message);
        setPricingLoaded(false);
      }
    }

    loadPricing();
  }, []);

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

    if (!firstName.trim() || !lastName.trim()) {
      return showError("Please enter your first and last name.");
    }
    if (!phone.trim() || phone.trim().length < 7) {
      return showError("Please enter a valid phone number.");
    }
    if (!email.includes("@")) {
      return showError("Please enter a valid email address.");
    }
    if (!arrowModel.trim()) return showError("Please enter an arrow model.");
    if (!spine.trim()) return showError("Please enter arrow spine.");
    if (!fletchingColors.trim())
      return showError("Please enter fletching colors.");

    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum < 6) {
      return showError("Quantity must be at least 6.");
    }
    if (qtyNum % 6 !== 0) {
      return showError("Quantity must be in multiples of 6.");
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

  // Live estimated price based on ARROW_BASE, WRAP_ADDON, FLETCHING_LABOR
  const estimate = (() => {
    const qtyNum = parseInt(form.quantity, 10);
    if (!pricingLoaded || !qtyNum || isNaN(qtyNum)) return null;

    const baseItem = pricingMap["ARROW_BASE"];
    const wrapItem = pricingMap["WRAP_ADDON"];
    const fletchItem = pricingMap["FLETCHING_LABOR"];

    const base =
      baseItem && baseItem.price
        ? Number(baseItem.price) * qtyNum
        : 0;
    const wrap =
      form.wrap === "yes" && wrapItem && wrapItem.price
        ? Number(wrapItem.price) * qtyNum
        : 0;
    const fletch =
      fletchItem && fletchItem.price
        ? Number(fletchItem.price) * qtyNum
        : 0;

    const total = base + wrap + fletch;
    if (total <= 0) return null;

    return {
      qtyNum,
      base,
      wrap,
      fletch,
      total,
      baseItem,
      wrapItem,
      fletchItem,
    };
  })();

  return (
    <>
      <Head>
        <title>Custom Arrow Orders | Dewclaw Archery</title>
        <meta
          name="description"
          content="Order custom arrows tailored to your bow, draw cycle, and goals. Built by Dewclaw Archery’s expert technicians."
        />
      </Head>

      <section className="max-w-6xl mx-auto py-16 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-dew-gold mb-4">
            Custom Arrow Orders
          </h1>
          <p className="text-slate-200 max-w-2xl mx-auto">
            Submit your arrow build details and our team will prepare a custom
            spec, review your setup, and follow up with final pricing.
          </p>
        </header>

        {/* Pricing Table */}
        <PricingTable
          category="arrows"
          title="Arrow Component & Build Pricing"
        />

        {/* Live estimate panel (if pricing is configured) */}
        <div className="mt-8 mb-10">
          <h2 className="text-xl font-semibold text-dew-gold mb-2">
            Estimated Build Price
          </h2>

          {!pricingLoaded && !pricingError && (
            <p className="text-slate-300 text-sm">
              Loading pricing data…
            </p>
          )}

          {pricingError && (
            <p className="text-red-400 text-sm">
              {pricingError} Pricing estimate may not be available right now.
            </p>
          )}

          {estimate && (
            <div className="bg-slate-900/40 border border-slate-700 rounded-md p-4 text-sm text-slate-100">
              <p className="mb-2">
                Based on quantity: <strong>{estimate.qtyNum}</strong>
              </p>
              <ul className="space-y-1">
                {estimate.baseItem && (
                  <li>
                    {estimate.baseItem.name || "Arrows"}: $
                    {estimate.base.toFixed(2)}
                  </li>
                )}
                {estimate.wrapItem && form.wrap === "yes" && (
                  <li>
                    {estimate.wrapItem.name || "Wraps"}: $
                    {estimate.wrap.toFixed(2)}
                  </li>
                )}
                {estimate.fletchItem && (
                  <li>
                    {estimate.fletchItem.name || "Fletching Labor"}: $
                    {estimate.fletch.toFixed(2)}
                  </li>
                )}
              </ul>
              <hr className="my-2 border-slate-700" />
              <p className="font-semibold">
                Estimated Total: ${estimate.total.toFixed(2)}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                This is an estimate based on your current selections and our
                configured pricing. Final pricing will be confirmed by a
                technician before any payment is processed.
              </p>
            </div>
          )}

          {!estimate && pricingLoaded && !pricingError && (
            <p className="text-slate-300 text-sm">
              Adjust your quantity and options above to see an estimated total.
              If no pricing appears, make sure codes ARROW_BASE, WRAP_ADDON, and
              FLETCHING_LABOR are configured in the T.E.R.I. Pricing admin.
            </p>
          )}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
          {/* Info Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-dew-gold">
              How Custom Arrow Orders Work
            </h2>

            <p className="text-slate-200">
              Fill out the form with as much detail as possible. We use your bow
              specs, shooting style, and preferences to design a proper build.
            </p>

            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Quantities must be multiples of 6 (6, 12, 18, …).</li>
              <li>
                • If you've purchased arrows from us before, we can verify a
                previous build.
              </li>
              <li>• Our techs will contact you with any clarifying questions.</li>
            </ul>

            <p className="text-slate-400 text-sm">
              Pricing is shown above. Payment is handled after we confirm your
              build details.
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-slate-900/40 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-semibold text-dew-gold mb-4">
              Arrow Build Form
            </h2>

            {message && (
              <div
                className={`mb-4 px-4 py-3 rounded text-sm border ${
                  messageType === "error"
                    ? "bg-red-900/40 border-red-500 text-red-100"
                    : messageType === "success"
                    ? "bg-emerald-900/40 border-emerald-600 text-emerald-100"
                    : "bg-slate-800/40 border-slate-500 text-slate-100"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="dew-label">First Name</label>
                  <input
                    className="dew-input"
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="dew-label">Last Name</label>
                  <input
                    className="dew-input"
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="dew-label">Phone</label>
                  <input
                    className="dew-input"
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="dew-label">Email</label>
                  <input
                    className="dew-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Arrow Model */}
              <div>
                <label className="dew-label">Arrow Model</label>
                <input
                  className="dew-input"
                  type="text"
                  name="arrowModel"
                  value={form.arrowModel}
                  onChange={handleChange}
                />
              </div>

              {/* Spine + Cut Length */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="dew-label">Spine</label>
                  <input
                    className="dew-input"
                    type="text"
                    name="spine"
                    value={form.spine}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="dew-label">Cut Length (optional)</label>
                  <input
                    className="dew-input"
                    type="text"
                    name="cutLength"
                    value={form.cutLength}
                    onChange={handleChange}
                    placeholder="e.g. 28.25"
                  />
                </div>
              </div>

              {/* Fletching */}
              <div>
                <label className="dew-label">Fletching Colors</label>
                <input
                  className="dew-input"
                  type="text"
                  name="fletchingColors"
                  value={form.fletchingColors}
                  onChange={handleChange}
                />
              </div>

              {/* Wrap Selection */}
              <div>
                <label className="dew-label">Wrap</label>
                <select
                  className="dew-input"
                  name="wrap"
                  value={form.wrap}
                  onChange={handleChange}
                >
                  <option value="no">No Wrap</option>
                  <option value="yes">With Wrap</option>
                </select>
              </div>

              {form.wrap === "yes" && (
                <div>
                  <label className="dew-label">Wrap Color</label>
                  <input
                    className="dew-input"
                    type="text"
                    name="wrapColor"
                    value={form.wrapColor}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="dew-label">Quantity</label>
                <select
                  className="dew-input"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                >
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="18">18</option>
                  <option value="24">24</option>
                </select>
              </div>

              {/* Verify Previous */}
              <div>
                <label className="dew-label">Verify Previous Build?</label>
                <select
                  className="dew-input"
                  name="verifyPrevious"
                  value={form.verifyPrevious}
                  onChange={handleChange}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="dew-label">Additional Notes</label>
                <textarea
                  className="dew-input"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="dew-button w-full mt-6"
              >
                {submitting ? "Submitting…" : "Submit Order"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
