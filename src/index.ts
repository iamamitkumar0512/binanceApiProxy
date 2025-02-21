import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bianceSpotRoutes from "./routes/binanceSpot";

dotenv.config(); // Load environment variables
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json()); // Parse JSON request body

app.use("/api/binance/spot", bianceSpotRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, TypeScript with Express!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
