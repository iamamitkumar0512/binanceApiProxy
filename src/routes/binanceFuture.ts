import { Router } from "express";
import Binance from "binance-api-node";

const router = Router();
const client = Binance();

router.get("/marketsSymbol", async (req, res) => {
  try {
    const response = await client.futuresExchangeInfo();
    const marketData = response.symbols;
    const marketSymbol = marketData.map((markets: any) => markets.symbol);
    res.json({ marketSymbols: marketSymbol, total: marketSymbol.length });
  } catch (error) {
    console.error("Error fetching Binance data:", error);
    res.status(500).json({ error: "Failed to fetch Binance market symbols" });
  }
});
export default router;
