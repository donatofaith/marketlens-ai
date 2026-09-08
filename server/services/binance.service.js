const BINANCE_BASE_URLS = [
  "https://data-api.binance.vision",
  "https://api.binance.com",
  "https://api1.binance.com",
  "https://api2.binance.com",
  "https://api3.binance.com",
  "https://api4.binance.com"
];

const DEFAULT_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT"
];


/* =================================
   GENERIC BINANCE FETCH
================================= */

async function fetchBinance(endpoint) {
  let lastError = null;

  for (const baseUrl of BINANCE_BASE_URLS) {
    try {
      const response = await fetch(
        `${baseUrl}${endpoint}`,
        {
          headers: {
            Accept: "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          `${baseUrl} returned ${response.status}`
        );
      }

      return await response.json();

    } catch (error) {
      console.error(
        `Binance endpoint failed: ${baseUrl}`,
        error.message
      );

      lastError = error;
    }
  }

  throw new Error(
    `All Binance endpoints failed. ${
      lastError?.message || ""
    }`
  );
}


/* =================================
   24H TICKER
================================= */

async function getTicker(symbol) {
  const data = await fetchBinance(
    `/api/v3/ticker/24hr?symbol=${symbol}`
  );

  return {
    symbol: data.symbol,

    price: Number(data.lastPrice),

    changePercent: Number(
      data.priceChangePercent
    ),

    high24h: Number(data.highPrice),

    low24h: Number(data.lowPrice),

    volume: Number(data.volume),

    quoteVolume: Number(
      data.quoteVolume
    ),

    updatedAt: Number(data.closeTime)
  };
}


/* =================================
   MARKET SNAPSHOT
================================= */

async function getMarketSnapshot(
  symbols = DEFAULT_SYMBOLS
) {
  return Promise.all(
    symbols.map(
      (symbol) => getTicker(symbol)
    )
  );
}


/* =================================
   KLINES / CANDLESTICKS
================================= */

async function getKlines(
  symbol,
  interval = "1h",
  limit = 24
) {
  const data = await fetchBinance(
    `/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );

  return data.map((candle) => ({
    openTime: Number(candle[0]),
    open: Number(candle[1]),
    high: Number(candle[2]),
    low: Number(candle[3]),
    close: Number(candle[4]),
    volume: Number(candle[5]),
    closeTime: Number(candle[6]),
    quoteVolume: Number(candle[7]),
    trades: Number(candle[8])
  }));
}


/* =================================
   RECENT PRICE STRUCTURE
================================= */

async function getRecentStructure(symbol) {
  const rawCandles = await getKlines(
    symbol,
    "1h",
    25
  );

  const now = Date.now();

  const completedCandles =
    rawCandles.filter(
      (candle) =>
        candle.closeTime < now
    );

  const candles =
    completedCandles.slice(-24);

  if (candles.length < 2) {
    throw new Error(
      `Not enough completed candle data for ${symbol}.`
    );
  }

  const first = candles[0];

  const latest =
    candles[candles.length - 1];

  const highest = Math.max(
    ...candles.map(
      (candle) => candle.high
    )
  );

  const lowest = Math.min(
    ...candles.map(
      (candle) => candle.low
    )
  );

  const changePercent =
    (
      (latest.close - first.open) /
      first.open
    ) * 100;

  const averageQuoteVolume =
    candles.reduce(
      (total, candle) =>
        total + candle.quoteVolume,
      0
    ) / candles.length;

  return {
    symbol,

    interval: "1h",

    candleCount: candles.length,

    firstPrice: first.open,

    latestPrice: latest.close,

    highestPrice: highest,

    lowestPrice: lowest,

    changePercent: Number(
      changePercent.toFixed(2)
    ),

    averageQuoteVolume,

    latestCompletedCandleTime:
      latest.closeTime,

    candles
  };
}


/* =================================
   EXPORTS
================================= */

module.exports = {
  getTicker,
  getMarketSnapshot,
  getKlines,
  getRecentStructure
};