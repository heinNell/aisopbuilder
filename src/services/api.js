const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export async function generateSOP(params) {
  return fetchAPI('/api/sop/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function improveSOP(params) {
  return fetchAPI('/api/sop/improve', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function analyzeSOP(params) {
  return fetchAPI('/api/sop/analyze', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function generateSummary(params) {
  return fetchAPI('/api/sop/summarize', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function enhanceSentence(params) {
  return fetchAPI('/api/sop/enhance-sentence', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function generateTemplate(params) {
  return fetchAPI('/api/sop/template', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/sop/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'File upload failed');
  }

  return response.json();
}
