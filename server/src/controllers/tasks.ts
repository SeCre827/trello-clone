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
      socket.emit(SocketEventEnum.tasksCreateFailure, 'User is not authorized');
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
    io.to(data.boardId).emit(SocketEventEnum.tasksCreateSucess, savedTask);
  } catch (err) {
    socket.emit(SocketEventEnum.columnsCreateFailure, getErrorMessage(err));
    console.log(err);
  }
};

export const updateTask = async (
  io: Server,
  socket: SocketExtended,
  data: {
    boardId: string;
    taskId: string;
    fields: { title?: string; description?: string; columnId?: string };
  }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventEnum.tasksUpdateFailure,
        getErrorMessage('User is not authorized')
      );
      return;
    }
    const updatedTask = await TaskModel.findByIdAndUpdate(
      data.taskId,
      data.fields,
      { new: true }
    );
    io.to(data.boardId).emit(SocketEventEnum.tasksUpdateSucess, updatedTask);
  } catch (err) {
    console.log(err);
    socket.emit(SocketEventEnum.tasksUpdateFailure, getErrorMessage(err));
  }
};

export const deleteTask = async (
  io: Server,
  socket: SocketExtended,
  data: { boardId: string; taskId: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventEnum.tasksDeleteFailure,
        getErrorMessage('User is not authorized')
      );
      return;
    }
    await TaskModel.deleteOne({ _id: data.taskId });
    io.to(data.boardId).emit(SocketEventEnum.tasksDeleteSucess, data.taskId);
  } catch (err) {
    console.log(err);
    socket.emit(SocketEventEnum.tasksDeleteFailure, getErrorMessage(err));
  }
};
// db.tasks.insert({title: "First Task",description: 'The best Task', userId: ObjectId("641c3d993dbf12ebea1b8a0d"), boardId: ObjectId("641cee3219a42d1e454ee1de"), columnId: ObjectId("641ed020dd29d12b550fbd05")})
