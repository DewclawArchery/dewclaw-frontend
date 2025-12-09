"use client";

import { useEffect, useState } from "react";

export default function PricingTable({ category = "services", title }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPricing() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/wp-json/teri/v6/pricing?category=${category}`
        );
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Unable to load pricing.");
        }

        setItems(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPricing();
  }, [category]);

  return (
    <div className="my-10">
      {title && (
        <h2 className="text-3xl font-bold mb-6 border-b pb-2">{title}</h2>
      )}

      {loading && <p>Loading pricing...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p>No pricing items available yet.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="text-left p-3 border">Service</th>
                <th className="text-left p-3 border">Description</th>
                <th className="text-right p-3 border">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="odd:bg-gray-100 even:bg-gray-200 border-b"
                >
                  <td className="p-3 border font-semibold">{item.name}</td>
                  <td className="p-3 border">{item.description}</td>
                  <td className="p-3 border text-right">
                    ${Number(item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
