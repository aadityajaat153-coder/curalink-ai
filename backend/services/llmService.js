const axios = require("axios");

async function generateStructuredSummary(query, papers) {
  try {
    const prompt = `
You are a medical AI assistant.

Return ONLY valid JSON.
No explanation.
No extra text.

FORMAT:
{
  "overview": "string",
  "key_findings": ["string"],
  "treatment_insights": ["string"],
  "risks": ["string"]
}

Query: ${query}

Papers:
${papers.map(p => p.title).join("\n")}
`;

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "phi3:mini",
      prompt,
      stream: false
    });

    const raw = response.data.response;

    console.log("RAW LLM OUTPUT:\n", raw);

    // 🔥 SIMPLE SAFE PARSE
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      return fallbackResponse();
    }

    const jsonString = raw.substring(jsonStart, jsonEnd);

    return JSON.parse(jsonString);

  } catch (err) {
    console.error("LLM ERROR:", err.message);
    return fallbackResponse();
  }
}

// fallback so API never crashes
function fallbackResponse() {
  return {
    overview: "AI summary unavailable",
    key_findings: [],
    treatment_insights: [],
    risks: []
  };
}

module.exports = { generateStructuredSummary };