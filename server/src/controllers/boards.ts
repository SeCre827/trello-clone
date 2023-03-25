import { NextFunction, Response } from 'express';
import { Server } from 'socket.io';
import BoardModel from '../models/board';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import { SocketExtended } from '../types/socket.interface';

export const getBoards = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const boards = await BoardModel.find({ userId: req.user.id });
    res.send(boards);
  } catch (error) {
    next(error);
  }
};

export const getBoard = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const board = await BoardModel.findById(req.params.boardId);
    res.send(board);
  } catch (error) {
    next(error);
  }
};

export const createBoard = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const newBoard = new BoardModel({
      title: req.body.title,
      userId: req.user.id
    });

    const savedBoard = await newBoard.save();
    res.send(savedBoard);
  } catch (error) {
    next(error);
  }
};

export const joinBoard = (
  io: Server,
  socket: SocketExtended,
  data: { boardId: string }
) => {
  // adds this user (identified from the socket object) to the room with id = data.boardId
  console.log('server socket io join', socket.user);
  socket.join(data.boardId);
};

export const leaveBoard = (
  io: Server,
  socket: SocketExtended,
  data: { boardId: string }
) => {
  // removes this user (identified from the socket object) to the room with id = data.boardId
  console.log('server socket io leave', socket.user);
  socket.leave(data.boardId);
};

// db.boards.insert({title: "First Board", userId: ObjectId("641c3d993dbf12ebea1b8a0d")})
