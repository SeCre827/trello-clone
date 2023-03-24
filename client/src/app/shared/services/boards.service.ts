import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/environments/environment';
import { IBoard } from '../types/board.interface';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  constructor(private http: HttpClient) {}
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
}
