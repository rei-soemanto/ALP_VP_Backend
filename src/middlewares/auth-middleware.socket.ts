// import { ioSessionStore } from "../session-store/io-session-store";
import { Socket } from "socket.io";
import { verifyToken } from "../utils/jwt-util";

export const socketAuthMiddleware = (socket: any, next: any) => {
  try {
    const user = verifyToken((socket.handshake.query.token as string).replace('Bearer ', ''));
    socket.userId = user.id;

    if (!user) {
        next(new Error("Unauthorized user!"));
        return;
    }

    // ioSessionStore.set(user.id, socket);
    next();
  } catch (e) {
    console.log(e);
    next(new Error("Unauthorized user!"));
  }
}