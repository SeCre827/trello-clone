const mongoose = require('mongoose');
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as usersController from './controllers/users';
import * as boardsController from './controllers/boards';
import bodyParser from 'body-parser';
import authMiddleware from './middlewares/auth';
import cors from 'cors';
import { SocketEventEnum } from './types/socketEvents.enum';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('toJSON', {
  virtuals: true,
  transform: (_: any, converted: { _id: any }) => {
    delete converted._id;
  }
});

app.get('/', (req, res) => {
  res.send('API IS UP');
});

app.post('/api/users', usersController.register);
app.post('/api/users/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);
app.get('/api/boards', authMiddleware, boardsController.getBoards);
app.post('/api/boards', authMiddleware, boardsController.createBoard);
app.get('/api/boards/:boardId', authMiddleware, boardsController.getBoard);

io.on('connection', (socket) => {
  socket.on(SocketEventEnum.boardsJoin, (data) => {
    boardsController.joinBoard(io, socket, data);
  });
  socket.on(SocketEventEnum.boardsLeave, (data) => {
    boardsController.leaveBoard(io, socket, data);
  });
});

mongoose.connect('mongodb://localhost:27027/eltrello').then(() => {
  console.log('connected to mongodb');

  httpServer.listen(4001, () => {
    console.log('Api is listening on Port 4001');
  });
});
