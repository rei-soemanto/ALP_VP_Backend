import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import { PORT } from "./utils/env-util";
import { errorMiddleware } from "./middlewares/error-middleware";
import { httpAPIRouter } from "./routes/http/http-api";
import { socketAuthMiddleware } from "./middlewares/auth-middleware.socket";

export const app = express()

app.use(express.json())
app.use("/api", httpAPIRouter);
app.use(errorMiddleware)
app.use("/images", express.static("images"))

const server = http.createServer(app);

export const io = new IOServer(server, {
    cors: {
        origin: "*",
    }
});

io.use(socketAuthMiddleware);

server.listen(PORT || 3000, () => {
    console.log(`Connected to port ${PORT}`);
});