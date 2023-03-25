import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import ColumnModel from '../models/column';

export const getColumns = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('in middleware')
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



// db.columns.insert({title: "First Column", userId: ObjectId("641c3d993dbf12ebea1b8a0d"), boardId: ObjectId("641cee3219a42d1e454ee1de")})