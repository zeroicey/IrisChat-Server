import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Server } from "socket.io";
import type { Server as HTTPServer } from "node:http";

const app = new Hono();

const httpServer = serve({
  fetch: app.fetch,
  port: 3000,
});

const io = new Server(httpServer as HTTPServer, {
  cors: {
    origin: "*",
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log(token)
  if (!token) {
    return next(new Error("No Token Provided"))
  }
  if (token !== "secret") {
    return next(new Error("Invalid Token"))
  }
  next()
})

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (msg) => {
    io.emit("message", `${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  })
});
