const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const marketRoutes = require("./routes/market.routes");
const agentRoutes = require("./routes/agent.routes");
const mcpRoutes = require("./routes/mcp.routes");

const app = express();

const PORT = process.env.PORT || 3000;


/* =================================
   MIDDLEWARE
================================= */

app.use(cors());
app.use(express.json());


/* =================================
   STATIC CLIENT
================================= */

app.use(
  express.static(
    path.join(__dirname, "../client")
  )
);


/* =================================
   HEALTH CHECK
================================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MarketLens AI server is running."
  });
});


/* =================================
   MARKET ROUTES
================================= */

app.use("/api/markets", marketRoutes);


/* =================================
   AGENT ROUTES
================================= */

app.use("/api/agent", agentRoutes);


/* =================================
   BINANCE MCP ROUTES
================================= */

app.use("/api/mcp", mcpRoutes);


/* =================================
   CLIENT FALLBACK
================================= */

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/index.html")
  );
});


/* =================================
   START SERVER
================================= */

/*
  Start normally when running locally
  with npm start / npm run dev.

  On Vercel, the Express app is exported
  and handled as a serverless function.
*/

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `MarketLens AI running at http://localhost:${PORT}`
    );
  });
}

module.exports = app;