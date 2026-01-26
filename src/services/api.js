// In Vercel, API routes are at /api/* (same origin)
// In local dev, we use the backend server
const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * Get provider settings from localStorage
 */
function getProviderSettings() {
  try {
    const saved = localStorage.getItem("aiProviderSettings");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading provider settings:", e);
  }
  return { provider: "groq", model: null, autoFallback: true };
}

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API request failed");
  }

  return response.json();
}

/**
 * Add provider settings to request body
 */
function withProviderSettings(params) {
  const settings = getProviderSettings();
  return {
    ...params,
    provider: settings.provider,
    model: settings.model,
  };
}

export async function generateSOP(params) {
  return fetchAPI("/api/sop/generate", {
    method: "POST",
    body: JSON.stringify(withProviderSettings(params)),
  });
}

export async function improveSOP(params) {
  return fetchAPI("/api/sop/improve", {
    method: "POST",
    body: JSON.stringify(withProviderSettings(params)),
  });
}

export async function analyzeSOP(params) {
  return fetchAPI("/api/sop/analyze", {
    method: "POST",
    body: JSON.stringify(withProviderSettings(params)),
  });
}

export async function generateSummary(params) {
  return fetchAPI("/api/sop/summarize", {
    method: "POST",
    body: JSON.stringify(withProviderSettings(params)),
  });
}

export async function enhanceSentence(params) {
  return fetchAPI("/api/sop/enhance-sentence", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function generateTemplate(params) {
  return fetchAPI("/api/sop/template", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/sop/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "File upload failed");
  }

  return response.json();
}
