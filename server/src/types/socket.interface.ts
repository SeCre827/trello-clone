import { Socket } from 'socket.io';
import { UserDocument } from './user.interface';

export interface SocketExtended extends Socket {
  user?: UserDocument;
}
