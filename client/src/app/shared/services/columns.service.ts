import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/environments/environment';
import { IColumn } from '../types/column.interface';
import { IColumnRequest } from '../types/columnRequest.interface';
import { SocketEventEnum } from '../types/socketEvents.enum';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  constructor(private http: HttpClient, private socketService: SocketService) {}
  getColumns(boardId: string): Observable<IColumn[]> {
    const url = `${enviroment.apiUrl}/boards/${boardId}/columns`;
    return this.http.get<IColumn[]>(url);
  }

  createColumn(columInput: IColumnRequest): void {
    this.socketService.emit(SocketEventEnum.columnsCreate, columInput);
  }

  deleteColumn(boardId: string, columnId: string): void {
    this.socketService.emit(SocketEventEnum.columnsDelete, {
      boardId,
      columnId
    });
  }

  updateColumn(
    boardId: string,
    columnId: string,
    fields: { title: string }
  ): void {
    this.socketService.emit(SocketEventEnum.columnsUpdate, {
      boardId,
      columnId,
      fields
    });
  }
}
