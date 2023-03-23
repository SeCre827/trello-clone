const mongoose = require('mongoose');
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as usersController from './controllers/users';
import bodyParser from 'body-parser';
import authMiddleware from './middlewares/auth';
import cors from 'cors';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API IS UP');
});

app.post('/api/users', usersController.register);
app.post('/api/users/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);

io.on('connection', () => {
  console.log('connected');
});

mongoose.connect('mongodb://localhost:27027/eltrello').then(() => {
  console.log('connected to mongodb');

  httpServer.listen(4001, () => {
    console.log('Api is listening on Port 4001');
  });
});
