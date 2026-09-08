/* =================================
   RANGE POSITION
================================= */

function calculateRangePosition(
  market
) {

  const range =
    market.high24h -
    market.low24h;


  if (range <= 0) {

    return 50;

  }


  return (
    (
      (
        market.price -
        market.low24h
      ) /
      range
    ) *
    100
  );

}


/* =================================
   MOMENTUM LABEL
================================= */

function getMomentumLabel(
  changePercent
) {

  if (
    changePercent >= 3
  ) {

    return "Strong positive";

  }


  if (
    changePercent >= 1
  ) {

    return "Positive";

  }


  if (
    changePercent > -1
  ) {

    return "Neutral";

  }


  if (
    changePercent > -3
  ) {

    return "Negative";

  }


  return "Strong negative";

}


/* =================================
   TREND LABEL
================================= */

function getTrendLabel(
  changePercent
) {

  if (
    changePercent >= 2
  ) {

    return "Strong upward trend";

  }


  if (
    changePercent >= 0.5
  ) {

    return "Upward trend";

  }


  if (
    changePercent > -0.5
  ) {

    return "Sideways trend";

  }


  if (
    changePercent > -2
  ) {

    return "Downward trend";

  }


  return "Strong downward trend";

}


/* =================================
   STRUCTURE POSITION
================================= */

function calculateStructurePosition(
  structure
) {

  const range =
    structure.highestPrice -
    structure.lowestPrice;


  if (range <= 0) {

    return 50;

  }


  return (
    (
      (
        structure.latestPrice -
        structure.lowestPrice
      ) /
      range
    ) *
    100
  );

}


/* =================================
   VOLUME ACTIVITY
================================= */

function getVolumeActivity(
  structure
) {

  const candles =
    structure.candles || [];


  if (
    candles.length < 2
  ) {

    return {
      ratio: 1,
      label: "Normal"
    };

  }


  const latestCandle =
    candles[
      candles.length - 1
    ];


  const previousCandles =
    candles.slice(
      0,
      -1
    );


  const previousAverage =
    previousCandles.reduce(
      (
        total,
        candle
      ) =>
        total +
        candle.quoteVolume,
      0
    ) /
    previousCandles.length;


  if (
    previousAverage <= 0
  ) {

    return {
      ratio: 1,
      label: "Normal"
    };

  }


  const ratio =
    latestCandle.quoteVolume /
    previousAverage;


  let label =
    "Normal";


  if (
    ratio >= 1.5
  ) {

    label =
      "Elevated";

  } else if (
    ratio <= 0.65
  ) {

    label =
      "Below average";

  }


  return {

    ratio:
      Number(
        ratio.toFixed(
          2
        )
      ),

    label

  };

}


/* =================================
   MARKET ANALYSIS
================================= */

function analyzeMarket(
  market,
  structure = null
) {

  const rangePosition =
    calculateRangePosition(
      market
    );


  const analysis = {

    symbol:
      market.symbol,

    price:
      market.price,

    changePercent:
      market.changePercent,

    high24h:
      market.high24h,

    low24h:
      market.low24h,

    quoteVolume:
      market.quoteVolume,

    rangePosition:
      Number(
        rangePosition.toFixed(
          1
        )
      ),

    momentum:
      getMomentumLabel(
        market.changePercent
      )

  };


  if (!structure) {

    return analysis;

  }


  const structurePosition =
    calculateStructurePosition(
      structure
    );


  const volumeActivity =
    getVolumeActivity(
      structure
    );


  return {

    ...analysis,

    structure: {

      interval:
        structure.interval,

      candleCount:
        structure.candleCount,

      changePercent:
        structure.changePercent,

      trend:
        getTrendLabel(
          structure.changePercent
        ),

      highestPrice:
        structure.highestPrice,

      lowestPrice:
        structure.lowestPrice,

      structurePosition:
        Number(
          structurePosition.toFixed(
            1
          )
        ),

      averageQuoteVolume:
        structure.averageQuoteVolume,

      volumeActivity

    }

  };

}


/* =================================
   MARKET COMPARISON
================================= */

function compareMarkets(
  markets
) {

  const analyzed =
    markets.map(
      (
        market
      ) =>
        market.structure
          ? analyzeMarket(
              market.ticker,
              market.structure
            )
          : analyzeMarket(
              market
            )
    );


  const strongest =
    [
      ...analyzed
    ].sort(
      (
        a,
        b
      ) =>
        b.changePercent -
        a.changePercent
    )[0];


  const weakest =
    [
      ...analyzed
    ].sort(
      (
        a,
        b
      ) =>
        a.changePercent -
        b.changePercent
    )[0];


  const highestVolume =
    [
      ...analyzed
    ].sort(
      (
        a,
        b
      ) =>
        b.quoteVolume -
        a.quoteVolume
    )[0];


  let strongestStructure =
    null;


  const marketsWithStructure =
    analyzed.filter(
      (
        market
      ) =>
        market.structure
    );


  if (
    marketsWithStructure.length
  ) {

    strongestStructure =
      [
        ...marketsWithStructure
      ].sort(
        (
          a,
          b
        ) =>
          b.structure
            .changePercent -
          a.structure
            .changePercent
      )[0];

  }


  return {

    markets:
      analyzed,

    strongest,

    weakest,

    highestVolume,

    strongestStructure

  };

}


/* =================================
   EXPORTS
================================= */

module.exports = {

  analyzeMarket,

  compareMarkets,

  getMomentumLabel,

  getTrendLabel,

  getVolumeActivity

};