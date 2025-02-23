import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http"; // Move import to the top
import binanceSpotRoutes from "./routes/binanceSpot";
import binanceFutureRoutes from "./routes/binanceFuture";
import initializeSocket from "./config/socketConfig";
import setupProxy from "./services/binanceSocketProxyService";

dotenv.config(); // Load environment variables

const app = express();
const server = createServer(app);
const PORT = 3000;

app.use(cors());
app.use(express.json()); // Parse JSON request body

app.use("/api/binance/spot", binanceSpotRoutes);
app.use("/api/binance/future", binanceFutureRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, TypeScript with Express!" });
});

// Initialize WebSocket Server
const io = initializeSocket(server);

// Setup WebSocket Proxy
setupProxy(io);

// Start Server
server.listen(PORT, () => {
  console.log(`Server running with WebSocket on http://localhost:${PORT}`);
});
