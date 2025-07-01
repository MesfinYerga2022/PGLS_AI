// src/utils/openai.js

import axios from "axios";

// Make sure this matches the backend port!
const BACKEND_API_URL = "http://localhost:9020/api/openai/chat";

/**
 * Ask the backend to relay to OpenAI.
 * @param {Array} messages - [{role: 'system'|'user'|'assistant', content: string}]
 * @param {Object} opts - { model, max_tokens, temperature }
 * @returns {string} Assistant's reply
 */
export async function askOpenAI(messages, opts = {}) {
  try {
    const response = await axios.post(BACKEND_API_URL, {
      model: opts.model || "gpt-4o",
      messages,
      max_tokens: opts.max_tokens ?? 1024,
      temperature: opts.temperature ?? 0.2,
      ...opts,
    });

    // OpenAI-compatible format
    if (response.data.choices?.[0]?.message?.content) {
      return response.data.choices[0].message.content;
    }
    if (response.data.error) {
      throw new Error("[OpenAI Proxy] " + response.data.error);
    }
    throw new Error("[OpenAI Proxy] Unexpected response: " + JSON.stringify(response.data));
  } catch (err) {
    // Show meaningful error details
    if (err.response) {
      const { status, data } = err.response;
      throw new Error(
        `[openai.js] API Error ${status}: ${data.error?.message || JSON.stringify(data)}`
      );
    }
    throw new Error(`[openai.js] Request failed: ${err.message}`);
  }
}
