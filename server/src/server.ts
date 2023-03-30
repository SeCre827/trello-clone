const mongoose = require('mongoose');
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import * as usersController from './controllers/users';
import * as boardsController from './controllers/boards';
import * as columnsController from './controllers/columns';
import * as tasksController from './controllers/tasks';
import bodyParser from 'body-parser';
import authMiddleware from './middlewares/auth';
import cors from 'cors';
import { SocketEventEnum } from './types/socketEvents.enum';
import { secret } from './config';
import User from './models/user';
import { SocketExtended } from './types/socket.interface';
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

//  REST API
app.get('/', (req, res) => {
  res.send('API IS UP');
});

app.post('/api/users', usersController.register);
app.post('/api/users/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);
app.get('/api/boards', authMiddleware, boardsController.getBoards);
app.post('/api/boards', authMiddleware, boardsController.createBoard);
app.get('/api/boards/:boardId', authMiddleware, boardsController.getBoard);
app.get(
  '/api/boards/:boardId/columns',
  authMiddleware,
  columnsController.getColumns
);
app.get(
  '/api/boards/:boardId/columns/:columnId',
  authMiddleware,
  columnsController.getColumn
);
app.get('/api/boards/:boardId/tasks', authMiddleware, tasksController.getTasks);
app.get(
  '/api/boards/:boardId/tasks/:taskId',
  authMiddleware,
  tasksController.getTask
);

// Socket IO

io.use(async (socket: SocketExtended, next) => {
  try {
    const token = (socket.handshake.auth.token as string) ?? '';
    const data = jwt.verify(token, secret) as {
      id: string;
      email: string;
    };
    const user = await User.findById(data.id);
    if (!user) {
      return next(new Error('Authentication Error'));
    }
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication Error'));
  }
}).on('connection', (socket) => {
  socket.on(SocketEventEnum.boardsJoin, (data) => {
    boardsController.joinBoard(io, socket, data);
  });
  socket.on(SocketEventEnum.boardsLeave, (data) => {
    boardsController.leaveBoard(io, socket, data);
  });
  socket.on(SocketEventEnum.columnsCreate, (data) => {
    columnsController.createColumn(io, socket, data);
  });

  socket.on(SocketEventEnum.tasksCreate, (data) => {
    tasksController.createTask(io, socket, data);
  });
  socket.on(SocketEventEnum.boardsUpdate, (data) => {
    boardsController.updateBoard(io, socket, data);
  });
  socket.on(SocketEventEnum.boardsDelete, (data) => {
    boardsController.deleteBoard(io, socket, data);
  });
  socket.on(SocketEventEnum.columnsDelete, (data) => {
    columnsController.deleteColumn(io, socket, data);
  });
  socket.on(SocketEventEnum.columnsUpdate, (data) => {
    columnsController.updateColumn(io, socket, data);
  });
  socket.on(SocketEventEnum.tasksUpdate, (data) => {
    tasksController.updateTask(io, socket, data);
  });
  socket.on(SocketEventEnum.tasksDelete, (data) => {
    tasksController.deleteTask(io, socket, data);
  });
});

mongoose.connect('mongodb://localhost:27027/eltrello').then(() => {
  console.log('connected to mongodb');

  httpServer.listen(4001, () => {
    console.log('Api is listening on Port 4001');
  });
});
