import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/environments/environment';
import { ITask } from '../types/task.interface';
import { ITaskRequest } from '../types/taskRequest.interface';
import { SocketEventEnum } from '../types/socketEvents.enum';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient, private socketService: SocketService) {}
  getTasks(boardId: string): Observable<ITask[]> {
    const url = `${enviroment.apiUrl}/boards/${boardId}/tasks`;
    return this.http.get<ITask[]>(url);
  }


}
