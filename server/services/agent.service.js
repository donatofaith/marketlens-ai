const {
  getTicker,
  getMarketSnapshot,
  getRecentStructure
} = require(
  "./binance.service"
);

const {
  analyzeMarket,
  compareMarkets
} = require(
  "./analysis.service"
);


const SUPPORTED_ASSETS = {
  BTC: "BTCUSDT",
  ETH: "ETHUSDT",
  BNB: "BNBUSDT"
};


/* =================================
   INTENT DETECTION
================================= */

function understandIntent(
  query
) {

  const normalized =
    query.toUpperCase();


  const detectedAssets =
    Object.keys(
      SUPPORTED_ASSETS
    ).filter(
      (asset) =>
        normalized.includes(
          asset
        )
    );


  if (
    normalized.includes(
      "MORNING"
    ) ||
    normalized.includes(
      "BRIEF"
    )
  ) {

    return {
      type: "brief",
      assets: [
        "BTCUSDT",
        "ETHUSDT",
        "BNBUSDT"
      ]
    };

  }


  if (
    normalized.includes(
      "COMPARE"
    ) ||
    detectedAssets.length > 1
  ) {

    return {

      type: "compare",

      assets:
        detectedAssets.length
          ? detectedAssets.map(
              (asset) =>
                SUPPORTED_ASSETS[
                  asset
                ]
            )
          : [
              "BTCUSDT",
              "ETHUSDT",
              "BNBUSDT"
            ]

    };

  }


  if (
    detectedAssets.length === 1
  ) {

    return {

      type: "single",

      assets: [
        SUPPORTED_ASSETS[
          detectedAssets[0]
        ]
      ]

    };

  }


  return {
    type: "brief",
    assets: [
      "BTCUSDT",
      "ETHUSDT",
      "BNBUSDT"
    ]
  };

}


/* =================================
   HELPERS
================================= */

function cleanSymbol(
  symbol
) {

  return symbol.replace(
    "USDT",
    ""
  );

}


function formatLargeNumber(
  number
) {

  if (
    number >= 1e9
  ) {

    return (
      number /
      1e9
    ).toFixed(
      2
    ) + "B";

  }


  if (
    number >= 1e6
  ) {

    return (
      number /
      1e6
    ).toFixed(
      2
    ) + "M";

  }


  if (
    number >= 1e3
  ) {

    return (
      number /
      1e3
    ).toFixed(
      2
    ) + "K";

  }


  return Number(
    number
  ).toFixed(
    2
  );

}


/* =================================
   RANGE DESCRIPTION
================================= */

function getRangeDescription(
  position
) {

  if (
    position >= 70
  ) {

    return "upper portion";

  }


  if (
    position <= 30
  ) {

    return "lower portion";

  }


  return "middle";

}


/* =================================
   MARKET CONDITION
================================= */

function getMarketCondition(
  positiveCount,
  negativeCount,
  totalCount
) {

  if (
    positiveCount ===
    totalCount
  ) {

    return "broadly positive";

  }


  if (
    negativeCount ===
    totalCount
  ) {

    return "broadly negative";

  }


  if (
    positiveCount === 0 &&
    negativeCount === 0
  ) {

    return "largely flat";

  }


  return "mixed";

}


/* =================================
   MARKET OBSERVATION
================================= */

function createObservation(
  market
) {

  const asset =
    cleanSymbol(
      market.symbol
    );


  const range =
    getRangeDescription(
      market.rangePosition
    );


  return (
    `${asset} shows ` +
    `${market.momentum.toLowerCase()} ` +
    `24-hour momentum ` +
    `(${market.changePercent.toFixed(2)}%) ` +
    `and is trading around the ${range} ` +
    `of its 24-hour range.`
  );

}


/* =================================
   STRUCTURE OBSERVATION
================================= */

function createStructureObservation(
  market
) {

  if (
    !market.structure
  ) {

    return null;

  }


  const asset =
    cleanSymbol(
      market.symbol
    );


  const structure =
    market.structure;


  const range =
    getRangeDescription(
      structure.structurePosition
    );


  return (
    `${asset}'s recent ${structure.interval} ` +
    `structure shows a ` +
    `${structure.trend.toLowerCase()} ` +
    `(${structure.changePercent.toFixed(2)}%), ` +
    `with price around the ${range} ` +
    `of the recent candle range.`
  );

}


/* =================================
   VOLUME OBSERVATION
================================= */

function createVolumeObservation(
  market
) {

  if (
    !market.structure
  ) {

    return null;

  }


  const asset =
    cleanSymbol(
      market.symbol
    );


  const volume =
    market.structure
      .volumeActivity;


  return (
    `${asset}'s latest completed hourly ` +
    `volume is ${volume.label.toLowerCase()} ` +
    `at ${volume.ratio.toFixed(2)}x ` +
    `its recent average.`
  );

}


/* =================================
   COMPACT ASSET INSIGHT
================================= */

function createCompactAssetInsight(
  market
) {

  const asset =
    cleanSymbol(
      market.symbol
    );


  const structure =
    market.structure;


  if (
    !structure
  ) {

    return createObservation(
      market
    );

  }


  return (
    `${asset}: ` +
    `${market.changePercent.toFixed(2)}% over 24h; ` +
    `${structure.trend.toLowerCase()} ` +
    `on the recent hourly structure; ` +
    `${structure.volumeActivity.label.toLowerCase()} ` +
    `latest hourly volume ` +
    `(${structure.volumeActivity.ratio.toFixed(2)}x average).`
  );

}


/* =================================
   FULL MARKET INTELLIGENCE
================================= */

async function loadMarketIntelligence(
  symbol
) {

  const [
    ticker,
    structure
  ] =
    await Promise.all([
      getTicker(
        symbol
      ),

      getRecentStructure(
        symbol
      )
    ]);


  return analyzeMarket(
    ticker,
    structure
  );

}


/* =================================
   SINGLE ASSET REPORT
================================= */

async function runSingleAnalysis(
  symbol
) {

  const analysis =
    await loadMarketIntelligence(
      symbol
    );


  const asset =
    cleanSymbol(
      symbol
    );


  const structureObservation =
    createStructureObservation(
      analysis
    );


  return {

    type:
      "single",

    title:
      `${asset} Market Intelligence`,

    summary:
      `${createObservation(
        analysis
      )} ${
        structureObservation ||
        ""
      }`.trim(),

    markets: [
      analysis
    ],

    insights: [

      createObservation(
        analysis
      ),

      structureObservation,

      createVolumeObservation(
        analysis
      ),

      `${asset} recorded approximately ` +
        `$${formatLargeNumber(
          analysis.quoteVolume
        )} in USDT quote volume ` +
        `during the current 24-hour ticker window.`,

      `Current price is approximately ` +
        `${analysis.rangePosition}% through ` +
        `the reported 24-hour low-to-high range.`

    ].filter(
      Boolean
    ),

    risks: [
      "Short-term price movement can change rapidly.",
      "Recent candle structure describes observed behavior rather than future direction.",
      "Volume should be considered alongside other market information.",
      "This report is market research, not financial advice."
    ],

    generatedAt:
      new Date()
        .toISOString()

  };

}


/* =================================
   MULTI-ASSET COMPARISON
================================= */

async function runComparison(
  symbols
) {

  const markets =
    await Promise.all(
      symbols.map(
        async (
          symbol
        ) => {

          const [
            ticker,
            structure
          ] =
            await Promise.all([
              getTicker(
                symbol
              ),

              getRecentStructure(
                symbol
              )
            ]);


          return {
            ticker,
            structure
          };

        }
      )
    );


  const comparison =
    compareMarkets(
      markets
    );


  const strongestName =
    cleanSymbol(
      comparison
        .strongest
        .symbol
    );


  const weakestName =
    cleanSymbol(
      comparison
        .weakest
        .symbol
    );


  const volumeName =
    cleanSymbol(
      comparison
        .highestVolume
        .symbol
    );


  const insights = [

    `${strongestName} has the strongest ` +
      `relative 24-hour performance at ` +
      `${comparison.strongest.changePercent.toFixed(2)}%, ` +
      `while ${weakestName} is weakest at ` +
      `${comparison.weakest.changePercent.toFixed(2)}%.`,

    `${volumeName} has the highest USDT ` +
      `quote volume among the compared assets.`

  ];


  if (
    comparison.strongestStructure
  ) {

    insights.push(
      `${cleanSymbol(
        comparison
          .strongestStructure
          .symbol
      )} has the strongest recent hourly ` +
      `structure with a ` +
      `${comparison
        .strongestStructure
        .structure
        .changePercent
        .toFixed(2)}% move.`
    );

  }


  comparison
    .markets
    .forEach(
      (market) => {

        insights.push(
          createCompactAssetInsight(
            market
          )
        );

      }
    );


  return {

    type:
      "compare",

    title:
      "Multi-Asset Market Comparison",

    summary:
      `${strongestName} currently leads ` +
      `relative 24-hour performance, while ` +
      `${weakestName} trails the group. ` +
      `${volumeName} has the highest USDT ` +
      `quote volume among the analyzed markets.`,

    markets:
      comparison.markets,

    insights,

    risks: [
      "Relative market strength can change quickly.",
      "Hourly structure is descriptive rather than predictive.",
      "Higher volume does not guarantee future price performance.",
      "This comparison is market research, not financial advice."
    ],

    generatedAt:
      new Date()
        .toISOString()

  };

}


/* =================================
   MORNING MARKET BRIEF
================================= */

async function runMarketBrief() {

  const tickers =
    await getMarketSnapshot();


  const markets =
    await Promise.all(
      tickers.map(
        async (
          ticker
        ) => {

          const structure =
            await getRecentStructure(
              ticker.symbol
            );


          return {
            ticker,
            structure
          };

        }
      )
    );


  const comparison =
    compareMarkets(
      markets
    );


  const positiveMarkets =
    comparison
      .markets
      .filter(
        (market) =>
          market.changePercent > 0
      );


  const negativeMarkets =
    comparison
      .markets
      .filter(
        (market) =>
          market.changePercent < 0
      );


  const strongestName =
    cleanSymbol(
      comparison
        .strongest
        .symbol
    );


  const weakestName =
    cleanSymbol(
      comparison
        .weakest
        .symbol
    );


  const volumeName =
    cleanSymbol(
      comparison
        .highestVolume
        .symbol
    );


  const totalMarkets =
    comparison
      .markets
      .length;


  const marketCondition =
    getMarketCondition(
      positiveMarkets.length,
      negativeMarkets.length,
      totalMarkets
    );


  const insights = [

    `Market breadth: ` +
      `${positiveMarkets.length} of ${totalMarkets} assets are positive ` +
      `and ${negativeMarkets.length} are negative ` +
      `over the current 24-hour window.`,

    `Relative strength: ${strongestName} leads ` +
      `the group at ` +
      `${comparison.strongest.changePercent.toFixed(2)}%, ` +
      `while ${weakestName} is weakest at ` +
      `${comparison.weakest.changePercent.toFixed(2)}%.`,

    `Market activity: ${volumeName} has the ` +
      `highest USDT quote volume in the group.`

  ];


  if (
    comparison.strongestStructure
  ) {

    insights.push(
      `Short-term structure: ` +
      `${cleanSymbol(
        comparison
          .strongestStructure
          .symbol
      )} currently has the strongest ` +
      `recent hourly structure at ` +
      `${comparison
        .strongestStructure
        .structure
        .changePercent
        .toFixed(2)}%.`
    );

  }


  comparison
    .markets
    .forEach(
      (market) => {

        insights.push(
          createCompactAssetInsight(
            market
          )
        );

      }
    );


  return {

    type:
      "brief",

    title:
      "MarketLens Morning Brief",

    summary:
      `BTC, ETH and BNB currently show a ` +
      `${marketCondition} market picture: ` +
      `${positiveMarkets.length} positive and ` +
      `${negativeMarkets.length} negative ` +
      `over the 24-hour window. ` +
      `${strongestName} shows the strongest ` +
      `relative performance, while ` +
      `${weakestName} is the weakest.`,

    markets:
      comparison.markets,

    insights,

    risks: [
      "This briefing represents a current market snapshot.",
      "Hourly market structure can change as new candles form.",
      "Momentum and volume metrics are observational, not predictive.",
      "MarketLens provides research information, not financial advice."
    ],

    generatedAt:
      new Date()
        .toISOString()

  };

}


/* =================================
   AGENT RUNNER
================================= */

async function runAgent(
  query
) {

  const intent =
    understandIntent(
      query
    );


  if (
    intent.type ===
    "single"
  ) {

    return runSingleAnalysis(
      intent.assets[0]
    );

  }


  if (
    intent.type ===
    "compare"
  ) {

    return runComparison(
      intent.assets
    );

  }


  return runMarketBrief();

}


/* =================================
   EXPORTS
================================= */

module.exports = {

  runAgent,

  understandIntent

};