const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();

// ==============================
// ✅ ENV CHECK (IMPORTANT)
// ==============================
if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY missing");
} else {
  console.log("✅ GROQ_API_KEY loaded");
}

// ==============================
// ✅ INIT GROQ
// ==============================
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==============================
// ✅ MIDDLEWARES
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// ✅ ROOT ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("CuraLink API running...");
});

// ==============================
// 🔥 SUMMARY API (FIXED)
// ==============================
app.post("/api/summary", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query is required",
      });
    }

    console.log("👉 Query:", query);

    // 🔥 CALL GROQ
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "user",
          content: `Give a short, clear medical summary of ${query} with:
Overview
Key Findings
Treatment
Risks`,
        },
      ],
    });

    // 🔥 SAFE EXTRACTION (VERY IMPORTANT FIX)
    const text =
      response?.choices?.[0]?.message?.content || null;

    if (!text) {
      throw new Error("Empty response from Groq");
    }

    console.log("✅ Summary generated");

    res.json({
      success: true,
      summary: text,
    });

  } catch (error) {
    console.error("❌ FULL ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate summary",
    });
  }
});

// ==============================
// 📚 RESEARCH ROUTE
// ==============================
app.use("/api/research", require("./routes/research"));

// ==============================
// ❌ 404 HANDLER
// ==============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ==============================
// ❌ GLOBAL ERROR HANDLER
// ==============================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// ==============================
// 🚀 START SERVER
// ==============================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});