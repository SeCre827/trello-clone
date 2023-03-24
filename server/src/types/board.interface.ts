import { Document, Schema } from 'mongoose';

export interface Board {
  title: string;
  userId: Schema.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

export interface BoardDocument extends Board, Document {}
