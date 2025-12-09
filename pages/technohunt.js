import { useState } from "react";
import Head from "next/head";
import TechnoHuntCalendar from "../components/TechnoHuntCalendar";
import TechnoHuntBookingForm from "../components/TechnoHuntBookingForm";

export default function TechnoHuntPage() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmed, setConfirmed] = useState(null);

  return (
    <>
      <Head>
        <title>TechnoHUNT Booking | Dewclaw Archery</title>
        <meta
          name="description"
          content="Reserve your TechnoHUNT lane at Dewclaw Archery."
        />
      </Head>

      <section className="max-w-6xl mx-auto py-16 px-4 md:px-6">
        <h1 className="text-4xl font-bold text-dew-gold text-center mb-10">
          TechnoHUNT Lane Booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <TechnoHuntCalendar onSelectSlot={setSelectedSlot} />

          <TechnoHuntBookingForm
            selectedSlot={selectedSlot}
            onBooked={(json) => setConfirmed(json)}
          />
        </div>

        {confirmed && (
          <div className="mt-10 bg-emerald-900/40 border border-emerald-600 p-6 rounded">
            <h2 className="text-xl text-emerald-300 font-semibold">
              Booking Confirmed!
            </h2>
            <p className="text-slate-200 mt-2">
              We’ve reserved your lane. Check your email for details.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
