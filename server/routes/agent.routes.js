const express =
  require("express");

const {
  runAgent
} = require(
  "../services/agent.service"
);

const router =
  express.Router();


router.post(
  "/analyze",
  async (req, res) => {

    try {

      const {
        query
      } = req.body;


      if (
        !query ||
        typeof query !== "string"
      ) {

        return res
          .status(400)
          .json({
            success: false,
            message:
              "Please provide a research query."
          });

      }


      const report =
        await runAgent(
          query.trim()
        );


      res.json({
        success: true,

        query:
          query.trim(),

        source:
          "Binance Market Data",

        report
      });


    } catch (error) {

      console.error(
        "Agent error:",
        error
      );


      res
        .status(500)
        .json({
          success: false,

          message:
            "MarketLens could not complete the analysis."
        });

    }

  }
);


module.exports =
  router;