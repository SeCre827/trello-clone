import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ICurrentUser } from 'src/app/auth/types/currentUser.interface';
import { enviroment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket | undefined;
  constructor(private http: HttpClient) {}
  setupSocketConnection(currentUser: ICurrentUser): void {
    this.socket = io(enviroment.SocketUrl, {
      auth: {
        token: currentUser.token
      }
    });
  }

  disconnect(): void {
    if (!this.socket) {
      throw new Error('Socket connection is not established');
    }
    this.socket.disconnect();
  }

  emit(eventName: string, message: any): void {
    if (!this.socket) {
      throw new Error('Socket connection is not established');
    }
    this.socket.emit(eventName, message);
  }
}
