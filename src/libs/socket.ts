import { Server as SocketIO } from 'socket.io';
import { Server } from 'http';

let io: SocketIO;

export const initIO = (httpServer: Server): SocketIO => {
  io = new SocketIO(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', async (socket) => {
    const { organizationId } = socket.handshake.query;

    socket.join(`organization-${organizationId}-mainchannel`);

    socket.emit('ready');

    socket.on('disconnect', () => {});
  });

  return io;
};

export const getIO = (): SocketIO => {
  if (!io) {
    throw new Error('Socket IO not initialized');
  }
  return io;
};
