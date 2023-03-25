import { Document, Schema } from 'mongoose';

export interface Column {
  title: string;
  userId: Schema.Types.ObjectId;
  boardId: Schema.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

export interface ColumnDocument extends Column, Document {}
