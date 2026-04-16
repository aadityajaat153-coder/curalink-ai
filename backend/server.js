const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Test route (optional but useful)
app.get("/", (req, res) => {
  res.send("CuraLink API running...");
});

// ✅ Routes
app.use("/api/research", require("./routes/research"));
app.use("/api/summary", require("./routes/summary")); // optional (keep if you created it)

// ❌ Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

// ❌ Global error handler (very important)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);

  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});