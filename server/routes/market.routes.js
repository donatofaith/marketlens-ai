const express = require("express");

const {
  getMarketSnapshot
} = require(
  "../services/binance.service"
);

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const markets =
      await getMarketSnapshot();

    res.json({
      success: true,
      source: "Binance",
      markets
    });
  } catch (error) {
    console.error(
      "Market route error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to retrieve Binance market data."
    });
  }
});

module.exports = router;