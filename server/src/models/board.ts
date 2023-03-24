import { model, Schema } from 'mongoose';
import { BoardDocument } from '../types/board.interface';

const boardSchema = new Schema<BoardDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model<BoardDocument>('Board', boardSchema);
