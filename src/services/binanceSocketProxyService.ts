import { Server as SocketIOServer, Socket } from "socket.io";
import { io as ClientIO, Socket as ClientSocket } from "socket.io-client";

const BINANCE_WS_URL = "wss://stream.binance.com:9443";

const setupProxy = (io: SocketIOServer): void => {
  io.on("connection", (clientSocket: Socket) => {
    console.log("Client connected to WebSocket Proxy");

    // Connect to the bianance WebSocket server
    const targetSocket: ClientSocket = ClientIO(BINANCE_WS_URL);

    targetSocket.on("connect", () => {
      console.log("Connected to Binance WebSocket Server");
    });
  });
};

export default setupProxy;
