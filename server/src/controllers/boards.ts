import { NextFunction, Request, Response } from 'express';
import BoardModel from '../models/board';
import { ExpressRequestInterface } from '../types/expressRequest.interface';

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
    console.log('trying');
    if (!req.user) {
      return res.sendStatus(401);
    }
    console.log(req.params.id);
    const board = await BoardModel.findById(req.params.id);
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

// db.boards.insert({title: "First Board", userId: ObjectId("641c3d993dbf12ebea1b8a0d")})
