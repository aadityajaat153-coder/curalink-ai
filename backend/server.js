const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();

// ✅ Init Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("CuraLink API running...");
});


// ==============================
// 🔥 SUMMARY API (MAIN PART)
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

    // 👉 Call Groq
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Give a medical summary of ${query} in this format:

Overview:
Key Findings:
Treatment:
Risks:`,
        },
      ],
      model: "llama3-8b-8192",
    });

    const text = response.choices[0].message.content;

    res.json({
      success: true,
      summary: text,
    });

  } catch (error) {
    console.error("❌ Summary Error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to generate summary",
    });
  }
});


// ==============================
// (OPTIONAL) EXISTING ROUTES
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});