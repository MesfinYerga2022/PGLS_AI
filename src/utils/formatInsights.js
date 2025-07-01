// src/utils/formatInsights.js

// Example: parse GPT/AI output with 1. Insight ... Action: ...
export function formatInsightsForPptx(insightsText, brandColor = "fa8000", mainFont = "Arial") {
  // Split on pattern: 1. **Insight ... **Action: ...
  const entries = insightsText
    .split(/\d+\.\s+\*\*Insight:/g)
    .map(s => s.trim())
    .filter(Boolean);

  return entries.map((entry, idx) => {
    // Split insight and action
    const [insightPart, ...actionArr] = entry.split(/\*\*Action:\*\*/);
    const insightText = insightPart.replace(/\*\*/g, "").trim();
    const actionText = actionArr.join("").replace(/\*\*/g, "").trim();

    // Return pptxgenjs rich text array
    return [
      { text: `Insight ${idx + 1}: `, options: { bold: true, color: brandColor, fontSize: 14, fontFace: mainFont } },
      { text: insightText + "\n", options: { color: "222222", fontSize: 13, fontFace: mainFont } },
      { text: "Action: ", options: { bold: true, color: brandColor, fontSize: 13, fontFace: mainFont } },
      { text: actionText, options: { color: "222222", fontSize: 12, fontFace: mainFont } }
    ];
  });
}
