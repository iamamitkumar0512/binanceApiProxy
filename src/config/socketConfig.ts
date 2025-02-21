import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

const initializeSocket = (server: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  console.log("Socket.IO initialized");

  return io;
};

export default initializeSocket;
