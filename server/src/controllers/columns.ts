import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import { Server } from 'socket.io';

import ColumnModel from '../models/column';
import { SocketExtended } from '../types/socket.interface';
import { SocketEventEnum } from '../types/socketEvents.enum';
import { getErrorMessage } from '../helpers';

export const getColumns = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('in middleware');
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

export const createColumn = async (
  io: Server,
  socket: SocketExtended,
  data: { boardId: string; title: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventEnum.columnCreateFailure,
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
    io.to(data.boardId).emit(SocketEventEnum.columnCreateSucess, savedColumn);
    console.log('savedColumn: ', savedColumn);
  } catch (err) {
    socket.emit(SocketEventEnum.columnCreateFailure, getErrorMessage(err));
  }
};

// db.columns.insert({title: "First Column", userId: ObjectId("641c3d993dbf12ebea1b8a0d"), boardId: ObjectId("641cee3219a42d1e454ee1de")})
