"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const binanceSpot_1 = __importDefault(require("./routes/binanceSpot"));
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Parse JSON request body
app.use("/api/binance/spot", binanceSpot_1.default);
app.get("/", (req, res) => {
    res.json({ message: "Hello, TypeScript with Express!" });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
