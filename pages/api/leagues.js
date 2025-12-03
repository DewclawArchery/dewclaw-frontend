export default async function handler(req, res) {
  try {
    const wpRes = await fetch(
      "https://www.dewclawarchery.com/wp-json/teri/v5/leagues"
    );

    const text = await wpRes.text();

    if (!wpRes.ok) {
      console.error("WP leagues error:", text);
      return res.status(400).json({ error: "Could not load leagues" });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("JSON parse error:", err);
      return res.status(500).json({ error: "Invalid response from server" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Fetch failed" });
  }
}
