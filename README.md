# MarketLens AI

> AI-powered crypto market intelligence built with Binance Agent OS.

MarketLens AI is a market research agent that transforms live Binance market data into structured, easy-to-understand intelligence reports.

Instead of presenting traders with raw numbers alone, MarketLens analyzes market momentum, recent candle structure, volume activity, relative strength, and 24-hour market conditions across supported assets.

## Built for Binance Agent OS Mini Hackathon

**Track:** Track A — Build an AI Agent with Agent OS

MarketLens demonstrates how Binance Agent OS can be used as an intelligence layer for crypto market research.

The project uses Binance market data together with Binance Agent OS MCP integration to support agent-driven market analysis.

## What MarketLens Does

Users can ask MarketLens questions such as:

- `Analyze BTCUSDT`
- `Compare BTC, ETH & BNB`
- `Morning market brief`

MarketLens then follows an intelligence workflow:

1. Understand the research request
2. Retrieve Binance market information
3. Analyze relevant market metrics
4. Generate a structured intelligence report

## Intelligence Features

### Single-Asset Analysis

MarketLens can analyze an individual supported market and report:

- Current market price
- 24-hour price performance
- Position within the 24-hour trading range
- Recent hourly candle structure
- Recent volume activity
- Market observations
- Risks and limitations

### Multi-Asset Comparison

MarketLens compares BTC, ETH and BNB using:

- Relative 24-hour performance
- Quote volume
- Recent hourly structure
- Volume activity
- Relative market strength

### Morning Market Brief

The Morning Brief provides a compact overview of the supported market set.

It identifies:

- Market breadth
- Broad market condition
- Strongest relative performer
- Weakest relative performer
- Highest-volume asset
- Strongest recent hourly structure

The market condition is classified dynamically as broadly positive, broadly negative, mixed, or largely flat based on current data.

## Binance Agent OS / MCP

MarketLens is integrated with the Binance Agent OS MCP ecosystem.

During development, the Binance MCP server was connected and authenticated through Visual Studio Code.

The MCP connection successfully exposed Binance tools, including the Binance Spot symbol price ticker, and was verified by retrieving live BTCUSDT market data through the connected MCP server.

MCP endpoint:

```text
https://agent.binance.com/mcp/agentic
```

The application itself focuses on read-only market intelligence and does not place trades.

## Market Intelligence Workflow

```text
User Research Prompt
        |
        v
Intent Detection
        |
        v
Binance Market Data
        |
        v
Market Analysis Engine
        |
        v
Structured Intelligence
        |
        v
MarketLens Report
```

MarketLens separates market-data retrieval from the analysis layer so that raw market information can be transformed into explainable observations.

## Technology Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript

### Backend

- Node.js
- Express.js

### Binance

- Binance market data
- Binance Agent OS
- Binance MCP
- Binance Spot market information

### MCP

- Model Context Protocol
- `@modelcontextprotocol/client`

## Project Structure

```text
marketlens-ai/
│
├── client/
│   ├── assets/
│   ├── css/
│   ├── js/
│   └── index.html
│
├── server/
│   ├── routes/
│   ├── services/
│   │   ├── agent.service.js
│   │   ├── analysis.service.js
│   │   ├── binance.service.js
│   │   └── binance-mcp.service.js
│   ├── utils/
│   └── server.js
│
├── docs/
│   ├── architecture.md
│   └── demo-script.md
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Running MarketLens Locally

Clone the repository:

```bash
git clone <your-repository-url>
```

Enter the project:

```bash
cd marketlens-ai
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Example Research Queries

```text
Analyze BTCUSDT
```

```text
Compare BTC, ETH & BNB
```

```text
Morning market brief
```

## Research, Not Financial Advice

MarketLens is designed for market research and educational purposes.

Its reports describe observed market data and recent market structure. They do not predict future prices and should not be interpreted as financial advice or trading recommendations.

## Hackathon Demo

The demo showcases:

- Live Binance market data
- Binance Agent OS / MCP connectivity
- AI-agent-style research workflow
- Single-asset intelligence
- Multi-asset comparison
- Automated market briefing
- Structured risk and limitation reporting

## Author

Built by **Donato Faith** for the **Binance Agent OS Mini Hackathon**.