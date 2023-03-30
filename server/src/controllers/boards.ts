import { NextFunction, Response } from 'express';
import { Server } from 'socket.io';
import { getErrorMessage } from '../helpers';
import BoardModel from '../models/board';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import { SocketExtended } from '../types/socket.interface';
import { SocketEventEnum } from '../types/socketEvents.enum';

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

export const updateBoard = async (
  io: Server,
  socket: SocketExtended,
  data: { boardId: string; fields: { title: string } }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventEnum.boardsUpdateFailure,
        getErrorMessage('User is not authorized')
      );
      return;
    }
    const updatedBoard = await BoardModel.findByIdAndUpdate(
      data.boardId,
      data.fields,
      { new: true }
    );
    io.to(data.boardId).emit(SocketEventEnum.boardsUpdateSucess, updatedBoard);
  } catch (err) {
    console.log(err);
    socket.emit(SocketEventEnum.boardsUpdateFailure, getErrorMessage(err));
  }
};

export const deleteBoard = async (
  io: Server,
  socket: SocketExtended,
  data: { boardId: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventEnum.boardsUpdateFailure,
        getErrorMessage('User is not authorized')
      );
      return;
    }
    await BoardModel.deleteOne({ _id: data.boardId });
    io.to(data.boardId).emit(SocketEventEnum.boardsDeleteSucess);
  } catch (err) {
    console.log(err);
    socket.emit(SocketEventEnum.boardsUpdateFailure, getErrorMessage(err));
  }
};

// db.boards.insert({title: "First Board", userId: ObjectId("641c3d993dbf12ebea1b8a0d")})
