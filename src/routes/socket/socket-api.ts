
export const socketAPIRouter = (socket) => {
    socket.on('counterPartId', (counterPartId) => {
        // socket.currentCounterPartId = counterPartId;
        socket.join(`user:${socket.userId}:${counterPartId}`);

        console.log('Socket joined room:', `user:${socket.userId}:${counterPartId}`);

        socket.on('disconnect', () => {
            socket.leave(`user:${socket.userId}:${counterPartId}`);
            console.log('Socket left room:', `user:${socket.userId}:${counterPartId}`);
        });
    });
};