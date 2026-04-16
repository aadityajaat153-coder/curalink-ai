const express = require("express");
const router = express.Router();

// Services
const { fetchPubMed } = require("../services/pubmedService");
const { generateStructuredSummary } = require("../services/llmService");
const { fetchClinicalTrials } = require("../services/clinicalTrialsService");

// Route: /api/research?query=...
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    // 🔒 Validation
    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Query is required"
      });
    }

    // 🔍 Fetch research papers
    const papers = await fetchPubMed(query);

    // 🤖 Generate AI summary
    const summary = await generateStructuredSummary(query, papers);

    // 🧪 Fetch clinical trials
    const trials = await fetchClinicalTrials(query);

    // ✅ Final response
    res.json({
      success: true,
      query,
      summary,
      papers,
      trials
    });

  } catch (err) {
    console.error("❌ Research API Error:", err.message);

    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

module.exports = router;