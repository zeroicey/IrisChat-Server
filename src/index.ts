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
  /* options */
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("No Token Provided"))
  }

  next()
})

io.on("connection", (socket) => {
});
