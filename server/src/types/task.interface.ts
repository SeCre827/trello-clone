import { Document, Schema } from 'mongoose';

export interface Task {
  title: string;
  description: string;
  userId: Schema.Types.ObjectId;
  boardId: Schema.Types.ObjectId;
  columnId: Schema.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

export interface TaskDocument extends Task, Document {}
