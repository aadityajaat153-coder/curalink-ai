const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();

// ==============================
// ✅ ENV CHECK
// ==============================
console.log("🔍 Checking ENV...");
if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY NOT FOUND");
} else {
  console.log("✅ GROQ_API_KEY LOADED");
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
// 🔥 SUMMARY API (ULTRA FIXED)
// ==============================
app.post("/api/summary", async (req, res) => {
  try {
    const { query } = req.body;

    console.log("👉 Incoming Query:", query);

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query is required",
      });
    }

    // ==============================
    // 🔥 GROQ CALL
    // ==============================
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192", // ✅ more stable
      messages: [
        {
          role: "user",
          content: `Explain ${query} in simple medical terms.

Give output in this format:

Overview:
Key Findings:
Treatment:
Risks:`,
        },
      ],
    });

    console.log("👉 RAW GROQ RESPONSE:", JSON.stringify(response, null, 2));

    const text = response?.choices?.[0]?.message?.content;

    // ==============================
    // ❌ IF EMPTY RESPONSE
    // ==============================
    if (!text || text.trim() === "") {
      console.error("❌ Empty response from Groq");

      return res.json({
        success: true,
        summary: "⚠️ AI could not generate summary. Try again.",
      });
    }

    console.log("✅ Summary Generated Successfully");

    return res.json({
      success: true,
      summary: text,
    });

  } catch (error) {
    console.error("❌ GROQ ERROR FULL:", error);

    // ==============================
    // 🔥 FAIL SAFE RESPONSE
    // ==============================
    return res.json({
      success: true,
      summary:
        "⚠️ AI service temporarily unavailable. Showing basic info. Please try again.",
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
  console.error("❌ SERVER ERROR:", err.stack);

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