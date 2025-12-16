import { verifyToken } from "../utils/jwt-util";

export const socketAuthMiddleware = (socket: any, next: any) => {
  try {
    socket.user = verifyToken(socket.handshake.auth.token);
    next();
  } catch {
    next(new Error("unauthorized"));
  }
}