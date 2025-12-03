// pages/api/league-signup.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    // Forward the JSON body straight to WordPress TERI endpoint
    const wpRes = await fetch(
      "https://www.dewclawarchery.com/wp-json/teri/v5/league/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const contentType = wpRes.headers.get("content-type") || "";
    const rawText = await wpRes.text();

    let data = null;
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.error("Failed to parse WP JSON:", e);
      }
    }

    // If WordPress responded with an error or HTML/critical error
    if (!wpRes.ok || !data || data.success === false) {
      console.error("WP signup error:", rawText);
      return res.status(400).json({
        success: false,
        error:
          (data && data.error) ||
          "There was an error processing your signup. We may still have received your info—please call the range to confirm.",
      });
    }

    // Successful signup – pass TERI's response straight through
    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error (Next.js → WP):", err);
    return res.status(500).json({
      success: false,
      error:
        "Could not reach the signup service. Please check your connection or try again shortly.",
    });
  }
}
