
export const socketAPIRouter = (socket) => {
    socket.join(`user:${socket.userId}`);
};