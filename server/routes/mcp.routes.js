const express =
  require("express");

const {
  listBinanceTools,
  getBinanceMCPStatus
} =
  require(
    "../services/binance-mcp.service"
  );


const router =
  express.Router();


/* =================================
   BINANCE MCP STATUS
================================= */

router.get(
  "/status",
  async (req, res) => {

    try {

      const status =
        await getBinanceMCPStatus();


      res.json({
        success: status.connected,
        service:
          "Binance Agent OS MCP",
        ...status
      });


    } catch (error) {

      console.error(
        "MCP status error:",
        error
      );


      res.status(500).json({
        success: false,
        message:
          "Unable to connect to Binance Agent OS MCP.",
        error:
          error.message
      });

    }

  }
);


/* =================================
   DISCOVER BINANCE MCP TOOLS
================================= */

router.get(
  "/tools",
  async (req, res) => {

    try {

      const tools =
        await listBinanceTools();


      const simplifiedTools =
        tools.map(
          (tool) => ({
            name:
              tool.name,

            description:
              tool.description ||
              "",

            inputSchema:
              tool.inputSchema ||
              null
          })
        );


      res.json({
        success: true,

        source:
          "Binance Agent OS MCP",

        toolCount:
          simplifiedTools.length,

        tools:
          simplifiedTools
      });


    } catch (error) {

      console.error(
        "MCP tools error:",
        error
      );


      res.status(500).json({
        success: false,

        message:
          "Unable to discover Binance MCP tools.",

        error:
          error.message
      });

    }

  }
);


module.exports =
  router;