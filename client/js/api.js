async function fetchMarkets() {
  const response =
    await fetch("/api/markets");

  if (!response.ok) {
    throw new Error(
      "Could not retrieve market data."
    );
  }

  const data =
    await response.json();

  if (!data.success) {
    throw new Error(
      data.message ||
      "Market data request failed."
    );
  }

  return data.markets;
}
async function runMarketAgent(
  query
) {

  const response =
    await fetch(
      "/api/agent/analyze",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            query
          })
      }
    );


  const data =
    await response.json();


  if (
    !response.ok ||
    !data.success
  ) {

    throw new Error(
      data.message ||
      "Agent analysis failed."
    );

  }


  return data.report;
}