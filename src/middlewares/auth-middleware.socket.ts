// import { ioSessionStore } from "../session-store/io-session-store";
import { verifyToken } from "../utils/jwt-util";

export const socketAuthMiddleware = (socket: any, next: any) => {
  try {
    const user = verifyToken(socket.handshake.auth.token);
    socket.userId = user.id;

    if (!user) {
        next(new Error("Unauthorized user!"));
        return;
    }

    // ioSessionStore.set(user.id, socket);
    next();
  } catch {
    next(new Error("Unauthorized user!"));
  }
}