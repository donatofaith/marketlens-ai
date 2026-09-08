# MarketLens AI — Architecture

## Overview

MarketLens AI is a read-only crypto market intelligence agent built for the Binance Agent OS Mini Hackathon.

The system retrieves live Binance market information, analyzes market structure and activity, and converts the results into structured intelligence reports.

## Architecture

User
↓
MarketLens Web Interface
↓
Agent Request
↓
Intent Detection
↓
Market Data Retrieval
↓
Analysis Engine
↓
Intelligence Generation
↓
Structured Market Report

## Core Components

### 1. Web Interface

The frontend provides the main interaction layer.

Users can request:

- BTC market analysis
- BTC, ETH and BNB comparison
- Morning market brief

The interface also visualizes the agent workflow:

1. Understand Request
2. Retrieve Market Data
3. Analyze
4. Generate Intelligence

### 2. Agent Service

`server/services/agent.service.js`

The agent service acts as the orchestration layer.

It determines the user's research intent and coordinates market-data retrieval and analysis.

Supported intents include:

- Single-asset analysis
- Multi-asset comparison
- Market briefing

### 3. Binance Market Data Service

`server/services/binance.service.js`

This service retrieves live public Binance market information used by the intelligence engine.

Market information includes:

- Current price
- 24-hour change
- 24-hour high and low
- Trading volume
- Quote volume
- Recent candlestick information

### 4. Analysis Engine

`server/services/analysis.service.js`

The analysis engine transforms raw market information into research metrics.

Examples include:

- 24-hour momentum
- Range position
- Relative performance
- Market breadth
- Recent candle structure
- Volume activity

The engine describes observed conditions rather than predicting future prices.

### 5. Binance Agent OS / MCP

MarketLens was developed and verified with the Binance Agent OS MCP server.

MCP endpoint:

`https://agent.binance.com/mcp/agentic`

During development, the MCP server was authenticated through Visual Studio Code and exposed Binance tools to the connected agent environment.

A Binance Spot symbol-price tool was successfully used to retrieve live BTCUSDT information, verifying the Agent OS MCP connection.

The application is intentionally focused on market intelligence rather than automated trading.

## Data Flow

A typical MarketLens request follows this flow:

User Prompt
→ Intent Detection
→ Binance Market Data
→ Metric Calculation
→ Market Structure Analysis
→ Intelligence Generation
→ Risk & Limitation Layer
→ User Report

For example:

`Analyze BTCUSDT`

MarketLens identifies BTC as the target asset, retrieves the required market information, analyzes its current structure, and generates a BTC Market Intelligence report.

## Safety Design

MarketLens is designed as a research system.

It does not:

- Automatically execute trades
- Tell users to buy or sell assets
- Guarantee market outcomes
- Predict guaranteed future prices

Every intelligence report includes risks and limitations.

## Design Principle

MarketLens follows one central principle:

> Turn raw market data into explainable market intelligence.

The goal is not to replace human decision-making, but to make Binance market information easier to research and understand.