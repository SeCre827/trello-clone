import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/environments/environment';
import { IColumn } from '../types/column.interface';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  constructor(private http: HttpClient) {}
  getColumns(boardId: string): Observable<IColumn[]> {
    const url = `${enviroment.apiUrl}/boards/${boardId}/columns`;
    return this.http.get<IColumn[]>(url);
  }
}
