import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/environments/environment';
import { IBoard } from '../types/board.interface';
import { SocketEventEnum } from '../types/socketEvents.enum';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  constructor(private http: HttpClient, private socketService: SocketService) {}
  getBoards(): Observable<IBoard[]> {
    const url = enviroment.apiUrl + '/boards';
    return this.http.get<IBoard[]>(url);
  }

  getBoard(boardId: string): Observable<IBoard> {
    const url = `${enviroment.apiUrl}/boards/${boardId}`;
    return this.http.get<IBoard>(url);
  }

  createBoard(title: string): Observable<IBoard> {
    const url = enviroment.apiUrl + '/boards';
    return this.http.post<IBoard>(url, { title });
  }

  updateBoard(boardId: string, fields: { title: string }): void {
    this.socketService.emit(SocketEventEnum.boardsUpdate, { boardId, fields });
  }
  

  deleteBoard(boardId: string): void {
    this.socketService.emit(SocketEventEnum.boardsDelete, { boardId });
  }
}
