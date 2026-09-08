const {
  Client,
  StreamableHTTPClientTransport
} = require(
  "@modelcontextprotocol/client"
);


const BINANCE_MCP_URL =
  "https://agent.binance.com/mcp/agentic";


let client = null;

let transport = null;

let connected = false;


/* =================================
   CREATE BINANCE MCP CLIENT
================================= */

async function connectBinanceMCP() {

  if (
    connected &&
    client
  ) {

    return client;

  }


  console.log(
    "Connecting to Binance Agent OS MCP..."
  );


  /*
    Binance Agent OS currently uses
    the MCP endpoint below.

    We use LEGACY negotiation directly
    so the SDK does not perform the
    newer server/discover probe first.
  */

  client =
    new Client(
      {
        name:
          "marketlens-ai",

        version:
          "1.0.0"
      },

      {
        versionNegotiation: {
          mode:
            "legacy"
        }
      }
    );


  transport =
    new StreamableHTTPClientTransport(
      new URL(
        BINANCE_MCP_URL
      ),

      {
        requestInit: {

          headers: {

            Accept:
              "application/json, text/event-stream"

          }

        }
      }
    );


  try {

    await client.connect(
      transport
    );


    connected = true;


    console.log(
      "MarketLens connected to Binance Agent OS MCP."
    );


    return client;


  } catch (error) {

    connected = false;


    client = null;

    transport = null;


    console.error(
      "Binance MCP connection failed:",
      error.message
    );


    throw error;

  }

}


/* =================================
   LIST BINANCE MCP TOOLS
================================= */

async function listBinanceTools() {

  const mcpClient =
    await connectBinanceMCP();


  const result =
    await mcpClient.listTools();


  return (
    result.tools || []
  );

}


/* =================================
   CALL BINANCE MCP TOOL
================================= */

async function callBinanceTool(
  toolName,
  args = {}
) {

  const mcpClient =
    await connectBinanceMCP();


  const result =
    await mcpClient.callTool(
      {
        name:
          toolName,

        arguments:
          args
      }
    );


  return result;

}


/* =================================
   BINANCE MCP STATUS
================================= */

async function getBinanceMCPStatus() {

  try {

    const mcpClient =
      await connectBinanceMCP();


    return {

      connected:
        true,

      endpoint:
        BINANCE_MCP_URL,

      serverVersion:
        mcpClient
          .getServerVersion(),

      capabilities:
        mcpClient
          .getServerCapabilities(),

      protocolEra:
        mcpClient
          .getProtocolEra()

    };


  } catch (error) {

    connected =
      false;


    return {

      connected:
        false,

      endpoint:
        BINANCE_MCP_URL,

      error:
        error.message

    };

  }

}


/* =================================
   CLOSE BINANCE MCP
================================= */

async function closeBinanceMCP() {

  try {

    if (transport) {

      await transport
        .terminateSession()
        .catch(
          () => {}
        );

    }


    if (client) {

      await client
        .close()
        .catch(
          () => {}
        );

    }

  } finally {

    client =
      null;

    transport =
      null;

    connected =
      false;

  }

}


/* =================================
   EXPORTS
================================= */

module.exports = {

  connectBinanceMCP,

  listBinanceTools,

  callBinanceTool,

  getBinanceMCPStatus,

  closeBinanceMCP

};