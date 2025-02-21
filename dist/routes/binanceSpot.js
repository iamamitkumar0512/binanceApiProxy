"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//@ts-ignore
const connector_1 = require("@binance/connector");
const unixToDate_1 = require("../utils/unixToDate");
const router = (0, express_1.Router)();
const client = new connector_1.Spot();
router.get("/marketsSymbol", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client.exchangeInfo();
        const marketData = response.data.symbols;
        const marketSymbol = marketData.map((markets) => markets.symbol);
        console.log(marketSymbol);
        res.json({ marketSymbols: marketSymbol, total: marketSymbol.length });
    }
    catch (error) {
        console.error("Error fetching Binance data:", error);
        res.status(500).json({ error: "Failed to fetch Binance market symbols" });
    }
}));
router.get("/marketOHLCVData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symbol, interval, limit, startTime, endTime } = req.query;
        if (!symbol || !interval) {
            return res
                .status(400)
                .json({ error: "Symbol and interval are required" });
        }
        const parsedLimit = limit ? parseInt(limit, 10) : 500;
        const parsedStartTime = startTime
            ? parseInt(startTime, 10)
            : undefined;
        const parsedEndTime = endTime ? parseInt(endTime, 10) : undefined;
        const response = yield client.klines(symbol, interval, {
            limit: parsedLimit,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
        });
        // Ensure `response.data` is an array of arrays matching `KlineData` format
        const marketOHLCVdata = response.map((ohlcvData) => ({
            openTime: (0, unixToDate_1.convertUnixToDateTime)(ohlcvData[0]),
            openPrice: ohlcvData[1],
            highPrice: ohlcvData[2],
            lowPrice: ohlcvData[3],
            closePrice: ohlcvData[4],
            volume: ohlcvData[5],
        }));
        return res.status(200).json({ data: marketOHLCVdata });
    }
    catch (error) {
        console.error("Error fetching Binance data:", error);
        return res
            .status(500)
            .json({ error: "Failed to fetch Binance OHLCV data" });
    }
}));
exports.default = router;
