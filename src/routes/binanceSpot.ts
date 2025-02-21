import express, { Request, Router } from "express";
//@ts-ignore
import { Spot } from "@binance/connector";
import { KlineData } from "../types/spotBinanceOHLCV";
import { convertUnixToDateTime } from "../utils/unixToDate";
import axios from "axios";

const router = Router();
const client = new Spot();

router.get("/marketsSymbol", async (req, res) => {
  try {
    const response = await client.exchangeInfo();
    const marketData: any[] = response.data.symbols;
    const marketSymbol = marketData.map((markets: any) => markets.symbol);
    res.json({ marketSymbols: marketSymbol, total: marketSymbol.length });
  } catch (error) {
    console.error("Error fetching Binance data:", error);
    res.status(500).json({ error: "Failed to fetch Binance market symbols" });
  }
});

router.get("/marketOHLCVData", async (req: Request, res: any) => {
  //StartTimeShould be in milisecond uixTimeStamp
  try {
    const { symbol, interval, limit, startTime } = req.query;

    if (!symbol || !interval) {
      return res
        .status(400)
        .json({ error: "Symbol and interval are required" });
    }

    const parsedLimit = limit ? parseInt(limit as string) : 500;
    let url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${parsedLimit}`;

    if (startTime) {
      url += `&startTime=${startTime}`;
    }

    const response = await axios.get(url);

    const marketOHLCVdata = (response.data as any).map(
      (ohlcvData: KlineData) => ({
        openTime: convertUnixToDateTime(ohlcvData[0]),
        openPrice: ohlcvData[1],
        highPrice: ohlcvData[2],
        lowPrice: ohlcvData[3],
        closePrice: ohlcvData[4],
        volume: ohlcvData[5],
      })
    );

    return res.status(200).json({ data: marketOHLCVdata });
  } catch (error) {
    console.error("Error fetching Binance data:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch Binance OHLCV data" });
  }
});

export default router;
