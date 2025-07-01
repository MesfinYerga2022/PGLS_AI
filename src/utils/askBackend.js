export async function askBackend(messages, opts = {}) {
  const res = await fetch("http://localhost:9000/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      max_tokens: opts.max_tokens || 1024,
      temperature: opts.temperature || 0.2
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}
