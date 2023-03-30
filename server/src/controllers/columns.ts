import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import { Server } from 'socket.io';

import ColumnModel from '../models/column';
import { SocketExtended } from '../types/socket.interface';
import { SocketEventEnum } from '../types/socketEvents.enum';
import { getErrorMessage } from '../helpers';
import column from '../models/column';

export const getColumns = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const columns = await ColumnModel.find({
      boardId: req.params.boardId
    });
    res.send(columns);
  } catch (error) {
    next(error);
  }
};

export const getColumn = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const column = await ColumnModel.findById(req.params.columnId);
    res.send(column);
  } catch (error) {
    next(error);
  }
};

export const createColumn = async (
  io: Server,
  socket: SocketExtended,
  data: { boardId: string; title: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventEnum.columnsCreateFailure,
        'User is not authorized'
      );
      return;
    }
    const newColumn = new ColumnModel({
      title: data.title,
      boardId: data.boardId,
      userId: socket.user.id
    });
    const savedColumn = await newColumn.save();
    io.to(data.boardId).emit(SocketEventEnum.columnsCreateSucess, savedColumn);
    console.log('savedColumn: ', savedColumn);
  } catch (err) {
    socket.emit(SocketEventEnum.columnsCreateFailure, getErrorMessage(err));
  }
};

export const deleteColumn = async (
  io: Server,
  socket: SocketExtended,
  data: { boardId: string; columnId: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventEnum.columnsDeleteFailure,
        getErrorMessage('User is not authorized')
      );
      return;
    }
    await ColumnModel.deleteOne({ _id: data.columnId });
    io.to(data.boardId).emit(
      SocketEventEnum.columnsDeleteSucess,
      data.columnId
    );
  } catch (err) {
    console.log(err);
    socket.emit(SocketEventEnum.columnsDeleteFailure, getErrorMessage(err));
  }
};

export const updateColumn = async (
  io: Server,
  socket: SocketExtended,
  data: { boardId: string; columnId: string; fields: { title: string } }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventEnum.columnsUpdateFailure,
        getErrorMessage('User is not authorized')
      );
      return;
    }
    const updatedColumn = await ColumnModel.findByIdAndUpdate(
      data.columnId,
      data.fields,
      { new: true }
    );
    io.to(data.boardId).emit(
      SocketEventEnum.columnsUpdateSucess,
      updatedColumn
    );
  } catch (err) {
    console.log(err);
    socket.emit(SocketEventEnum.columnsUpdateFailure, getErrorMessage(err));
  }
};
// db.columns.insert({title: "First Column", userId: ObjectId("641c3d993dbf12ebea1b8a0d"), boardId: ObjectId("641cee3219a42d1e454ee1de")})
