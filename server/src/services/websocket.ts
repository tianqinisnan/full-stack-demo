import { Server } from 'http';
import { Server as WebSocketServer } from 'socket.io';
import { EventType, NewMessageEvent, MessageReadEvent } from '../models/WebSocketEvent';

let io: WebSocketServer;

export const initializeWebSocket = (server: Server) => {
  io = new WebSocketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('join', (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

export const sendNewMessageNotification = (userId: string, data: NewMessageEvent) => {
  io?.to(userId).emit(EventType.NEW_MESSAGE, data);
};

export const sendMessageReadNotification = (userId: string, data: MessageReadEvent) => {
  io?.to(userId).emit(EventType.MESSAGE_READ, data);
}; 