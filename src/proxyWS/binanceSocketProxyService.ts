import { Server as SocketIOServer, Socket } from "socket.io";
import WebSocket from "ws";

const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws";

// Store Binance WebSocket connections for each user
const userConnections = new Map<string, WebSocket>();

interface StreamRequest {
  market: string; // e.g., "btcusdt"
  interval: string; // e.g., "1m", "5m"
}

const setupProxy = (io: SocketIOServer): void => {
  io.on("connection", (clientSocket: Socket) => {
    console.log("New client connected:", clientSocket.id);

    // After connect ui will send a event to ws with event name stream and market and interval in body parm
    clientSocket.on("stream", (data: StreamRequest) => {
      const { market, interval } = data || {};

      if (!market || !interval) {
        clientSocket.emit("error", { message: "Invalid market or interval" });
        return;
      }

      const streamKey = `${market}-${interval}`;
      if (userConnections.has(streamKey)) {
        console.log(`Reusing existing Binance WebSocket for: ${streamKey}`);
        return;
      }

      console.log(
        `Creating new Binance WebSocket for: ${market}@kline_${interval}`
      );

      const binanceSocket = new WebSocket(BINANCE_WS_URL);

      binanceSocket.on("open", () => {
        console.log(
          `Connected to Binance WebSocket for ${market}@kline_${interval}`
        );
        const subscriptionMessage = JSON.stringify({
          method: "SUBSCRIBE",
          params: [`${market.toLowerCase()}@kline_${interval}`], // Ensure lowercase
          id: 1,
        });

        binanceSocket.send(subscriptionMessage);
      });

      binanceSocket.on("message", (rawData: Buffer) => {
        try {
          const jsonData = JSON.parse(rawData.toString()); // Convert buffer to JSON

          // Emit event with parsed data
          clientSocket.emit("binance-data", jsonData);
        } catch (error) {
          console.error("Error parsing Binance WebSocket data:", error);
        }
      });

      binanceSocket.on("error", (err: any) => {
        console.error(`Binance WebSocket error: ${err.message}`);
        clientSocket.emit("error", { message: "Binance WebSocket error" });
      });

      binanceSocket.on("close", (code, reason) => {
        console.log(
          `Binance WebSocket closed for ${market}@kline_${interval} - Code: ${code}, Reason: ${reason}`
        );
      });

      userConnections.set(streamKey, binanceSocket);

      clientSocket.on("disconnect", () => {
        console.log(`Client disconnected: ${clientSocket.id}`);
        cleanupConnection(market, interval);
      });
    });
  });
};

/**
 * Closes Binance WebSocket before disconnecting.
 */
const cleanupConnection = (market: string, interval: string) => {
  const streamKey = `${market}-${interval}`;
  const binanceSocket = userConnections.get(streamKey);

  if (binanceSocket) {
    console.log(`Closing Binance WebSocket for ${market}@kline_${interval}`);
    binanceSocket.close();
    userConnections.delete(streamKey);
  }
};

export default setupProxy;
