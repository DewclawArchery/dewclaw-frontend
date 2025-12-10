// lib/api.js

/**
 * Normalize backend responses so all TERI Assistant endpoints
 * can be consumed the same way on the frontend.
 * 
 * Supported:
 *   - Raw arrays
 *   - Raw objects
 *   - { data: [...] }
 *   - { success: true, data: [...] }
 */

export async function apiGet(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`GET ${url} failed (${res.status})`);
  }

  const json = await res.json();

  // Case 1: Backend returns raw array
  if (Array.isArray(json)) {
    return json;
  }

  // Case 2: Backend returns { data: [...] }
  if (json && Array.isArray(json.data)) {
    return json.data;
  }

  // Case 3: Backend returns { success, data }
  if (json && json.success && Array.isArray(json.data)) {
    return json.data;
  }

  // Default: return parsed JSON
  return json;
}

export async function apiPost(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`POST ${url} failed (${res.status})`);
  }

  const json = await res.json();

  // Case 1: { data }
  if (json?.data) {
    return json.data;
  }

  // Case 2: return object response
  return json;
}
