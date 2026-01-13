// pages/cancellation-policy.js
import Head from "next/head";

export default function CancellationPolicy() {
  const lastUpdated = "January 12, 2026";

  return (
    <>
      <Head>
        <title>Cancellation &amp; Refund Policy | Dewclaw Archery</title>
        <meta
          name="description"
          content="Dewclaw Archery cancellation and refund policy for single-session bookings and leagues."
        />
        <meta name="robots" content="index,follow" />
      </Head>

      <main className="policy-page">
        <div className="container">
          <header className="header">
            <h1>Cancellation &amp; Refund Policy</h1>
            <p className="subhead">
              This policy applies to Dewclaw Archery single-session bookings
              (TechnoHunt, range sessions, classes) and league registrations.
            </p>
          </header>

          <section className="card">
            <h2>Single-Session Bookings (TechnoHunt, Range Sessions, Classes)</h2>

            <h3>Cancellation &amp; Rescheduling Requests</h3>
            <p>
              Cancellation or rescheduling requests must be submitted by email
              to{" "}
              <a
                href="mailto:Info@dewclawarchery.com"
                className="link"
              >
                Info@dewclawarchery.com
              </a>
              . Requests are time-stamped based on when the email is received.
            </p>

            <h3>Refund Eligibility</h3>
            <ul>
              <li>
                Requests received <strong>24 hours or more</strong> before the
                scheduled start time are eligible for a{" "}
                <strong>full refund or reschedule</strong>, subject to
                availability.
              </li>
              <li>
                Requests received <strong>less than 24 hours</strong> before the
                scheduled start time are <strong>not eligible for a refund</strong>.
              </li>
              <li>
                Failure to attend a scheduled session without prior notice
                (“no-show”) is <strong>not refundable</strong>.
              </li>
            </ul>

            <h3>Refund Method</h3>
            <p>
              Approved refunds are issued to the <strong>original payment method</strong>.
              Processing times vary by financial institution and typically take{" "}
              <strong>3–5 business days</strong>.
            </p>
          </section>

          <section className="card">
            <h2>League Registrations</h2>

            <h3>Commitment &amp; Capacity</h3>
            <p>
              League registrations reserve a recurring time slot for the full
              league duration. Capacity is limited, and each registration
              restricts availability for other participants.
            </p>

            <h3>Cancellation Requests</h3>
            <p>
              League cancellation requests must be submitted by email to{" "}
              <a
                href="mailto:Info@dewclawarchery.com"
                className="link"
              >
                Info@dewclawarchery.com
              </a>{" "}
              and must include participant name, league name, and scheduled time.
            </p>

            <h3>Refunds</h3>
            <ul>
              <li>
                League registrations are <strong>non-refundable once the league has begun</strong>.
              </li>
              <li>
                Prior to the league start date, refunds or credits{" "}
                <strong>may be issued at the sole discretion</strong> of Dewclaw
                Archery, based on timing, attendance, and capacity considerations.
              </li>
              <li>
                Dewclaw Archery reserves the right to issue{" "}
                <strong>store credit in lieu of a refund</strong>.
              </li>
            </ul>

            <h3>Rescheduling</h3>
            <ul>
              <li>
                Requests to change league day or time are subject to availability
                and are <strong>not guaranteed</strong>.
              </li>
              <li>
                Rescheduling approval is at the <strong>sole discretion</strong> of Dewclaw Archery.
              </li>
            </ul>
          </section>

          <section className="card">
            <h2>Coupons, Discounts &amp; Promotional Offers</h2>
            <ul>
              <li>
                Coupons, promotional discounts, and free registrations have{" "}
                <strong>no cash value</strong> and are <strong>non-refundable</strong>.
              </li>
              <li>Discounts cannot be retroactively applied.</li>
            </ul>
          </section>

          <section className="card">
            <h2>Facility or Staff-Initiated Cancellations</h2>
            <p>
              If Dewclaw Archery cancels a session due to weather, safety
              concerns, or operational needs, participants will be offered a{" "}
              <strong>reschedule, refund, or credit</strong>, at Dewclaw
              Archery’s discretion.
            </p>
          </section>

          <section className="card">
            <h2>How to Request a Cancellation or Reschedule</h2>
            <p>
              All requests must be submitted by email:{" "}
              <a
                href="mailto:Info@dewclawarchery.com"
                className="link"
              >
                Info@dewclawarchery.com
              </a>
              .
            </p>
            <p>Please include:</p>
            <ul>
              <li>Participant name</li>
              <li>Scheduled date/time or league details</li>
              <li>Requested action (cancel or reschedule)</li>
            </ul>
            <p className="muted">
              This policy is subject to change without notice.
            </p>
          </section>

          <footer className="footer">
            <div className="divider" />
            <p className="updated">Last updated: {lastUpdated}</p>
          </footer>
        </div>
      </main>

      <style jsx>{`
        .policy-page {
          min-height: 70vh;
          padding: 48px 16px 64px;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 22px;
        }

        h1 {
          margin: 0 0 10px;
          font-size: 34px;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .subhead {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
          line-height: 1.6;
        }

        .card {
          margin-top: 16px;
          padding: 18px 18px 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(6px);
        }

        h2 {
          margin: 0 0 10px;
          font-size: 20px;
          letter-spacing: -0.01em;
        }

        h3 {
          margin: 14px 0 6px;
          font-size: 15px;
          text-transform: none;
          opacity: 0.95;
        }

        p {
          margin: 0 0 10px;
          line-height: 1.65;
          font-size: 15px;
        }

        ul {
          margin: 0 0 10px 18px;
          padding: 0;
        }

        li {
          margin: 6px 0;
          line-height: 1.6;
          font-size: 15px;
        }

        .link {
          color: inherit;
          text-decoration: underline;
        }

        .muted {
          opacity: 0.85;
        }

        .footer {
          margin-top: 20px;
          opacity: 0.9;
        }

        .divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          margin: 18px 0 10px;
        }

        .updated {
          margin: 0;
          font-size: 13px;
          opacity: 0.85;
        }

        @media (max-width: 520px) {
          h1 {
            font-size: 28px;
          }
          .card {
            padding: 16px 14px 14px;
          }
        }
      `}</style>
    </>
  );
}
