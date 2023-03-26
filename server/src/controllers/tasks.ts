import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import { Server } from 'socket.io';

import TaskModel from '../models/task';
import { SocketExtended } from '../types/socket.interface';
import { SocketEventEnum } from '../types/socketEvents.enum';
import { getErrorMessage } from '../helpers';

export const getTasks = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const tasks = await TaskModel.find({
      boardId: req.params.boardId
    });
    res.send(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const task = await TaskModel.findById(req.params.taskId);
    res.send(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  io: Server,
  socket: SocketExtended,
  data: {
    boardId: string;
    title: string;
    columnId: string;
    description: string;
  }
) => {
  try {
    console.log('create task arrived', data);
    if (!socket.user) {
      console.log('user untothorized');
      socket.emit(SocketEventEnum.taskCreateFailure, 'User is not authorized');
      return;
    }
    const newTask = new TaskModel({
      title: data.title,
      boardId: data.boardId,
      columnId: data.columnId,
      userId: socket.user.id,
      description: data.description
    });
    const savedTask = await newTask.save();
    io.to(data.boardId).emit(SocketEventEnum.taskCreateSucess, savedTask);
  } catch (err) {
    socket.emit(SocketEventEnum.columnCreateFailure, getErrorMessage(err));
    console.log(err);
  }
};

// db.tasks.insert({title: "First Task",description: 'The best Task', userId: ObjectId("641c3d993dbf12ebea1b8a0d"), boardId: ObjectId("641cee3219a42d1e454ee1de"), columnId: ObjectId("641ed020dd29d12b550fbd05")})
