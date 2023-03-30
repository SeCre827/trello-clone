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

  createTask(taskInput: ITaskRequest): void {
    console.log('sent to socket', taskInput);
    this.socketService.emit(SocketEventEnum.tasksCreate, taskInput);
  }

  updateTask(
    boardId: string,
    taskId: string,
    fields: { title?: string; description?: string; columnId?: string }
  ): void {
    this.socketService.emit(SocketEventEnum.tasksUpdate, {
      boardId,
      taskId,
      fields
    });
  }

  deleteTask(boardId: string, taskId: string): void {
    this.socketService.emit(SocketEventEnum.tasksDelete, { boardId, taskId });
  }
}
