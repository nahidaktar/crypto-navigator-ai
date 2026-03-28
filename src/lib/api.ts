const RAPIDAPI_KEY = "89cf996b28msh00a09d2b6f216c5p10608bjsn00e07e7cedd7";

const CRYPTO_API_HOST = "crypto-technical-analysis-indicator-apis-for-trading.p.rapidapi.com";
const CHART_API_HOST = "chartmaster-ai-visual-stock-chart-technical-analysis.p.rapidapi.com";

const headers = {
  "x-rapidapi-key": RAPIDAPI_KEY,
  "Content-Type": "application/json",
};

export async function fetchSymbols() {
  const res = await fetch(
    `https://${CRYPTO_API_HOST}/symbols`,
    { headers: { ...headers, "x-rapidapi-host": CRYPTO_API_HOST } }
  );
  if (!res.ok) throw new Error("Failed to fetch symbols");
  return res.json();
}

export async function fetchIndicator(symbol: string, indicator: string, interval = "1d") {
  const res = await fetch(
    `https://${CRYPTO_API_HOST}/${indicator}?symbol=${symbol}&interval=${interval}`,
    { headers: { ...headers, "x-rapidapi-host": CRYPTO_API_HOST } }
  );
  if (!res.ok) throw new Error(`Failed to fetch ${indicator}`);
  return res.json();
}

export async function analyzeChart(imageUrl: string) {
  const res = await fetch(
    `https://${CHART_API_HOST}/analyze?imageUrl=${encodeURIComponent(imageUrl)}&lang=en&noqueue=1`,
    {
      method: "POST",
      headers: { ...headers, "x-rapidapi-host": CHART_API_HOST },
      body: JSON.stringify({}),
    }
  );
  if (!res.ok) throw new Error("Chart analysis failed");
  return res.json();
}

// Simulated real-time price data
const BASE_PRICES: Record<string, number> = {
  BTC: 67234.50, ETH: 3521.80, BNB: 598.40, SOL: 178.90, ADA: 0.62,
  DOT: 7.85, AVAX: 38.20, MATIC: 0.72, LINK: 14.35, UNI: 9.80,
  ATOM: 11.20, XRP: 0.58, DOGE: 0.165, SHIB: 0.0000245, LTC: 84.50,
  MONAD: 2.45,
};

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
  sparkline: number[];
}

const NAMES: Record<string, string> = {
  BTC: "Bitcoin", ETH: "Ethereum", BNB: "BNB", SOL: "Solana", ADA: "Cardano",
  DOT: "Polkadot", AVAX: "Avalanche", MATIC: "Polygon", LINK: "Chainlink", UNI: "Uniswap",
  ATOM: "Cosmos", XRP: "XRP", DOGE: "Dogecoin", SHIB: "Shiba Inu", LTC: "Litecoin",
  MONAD: "Monad",
};

function generateSparkline(base: number): number[] {
  const points: number[] = [];
  let val = base;
  for (let i = 0; i < 24; i++) {
    val += val * (Math.random() - 0.48) * 0.02;
    points.push(val);
  }
  return points;
}

function formatVolume(v: number): string {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  return `$${v.toFixed(0)}`;
}

export function getMarketData(): CryptoPrice[] {
  return Object.entries(BASE_PRICES).map(([symbol, base]) => {
    const change = (Math.random() - 0.45) * 10;
    const price = base * (1 + change / 100);
    return {
      symbol,
      name: NAMES[symbol] || symbol,
      price,
      change24h: change,
      volume: formatVolume(base * (Math.random() * 5e6 + 1e6)),
      marketCap: formatVolume(price * (Math.random() * 1e9 + 1e8)),
      sparkline: generateSparkline(price),
    };
  });
}

export function getAISignal(symbol: string): { action: "BUY" | "SELL" | "HOLD"; confidence: number; reason: string } {
  const r = Math.random();
  if (r > 0.6) return { action: "BUY", confidence: 70 + Math.random() * 25, reason: `Strong bullish momentum detected on ${symbol}. RSI oversold with MACD crossover.` };
  if (r > 0.3) return { action: "HOLD", confidence: 55 + Math.random() * 30, reason: `${symbol} showing consolidation. Wait for breakout confirmation above key resistance.` };
  return { action: "SELL", confidence: 60 + Math.random() * 30, reason: `Bearish divergence on ${symbol}. Volume declining with head-and-shoulders pattern forming.` };
}
