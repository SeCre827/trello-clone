import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from 'src/app/shared/services/socket.service';
import { IBoard } from 'src/app/shared/types/board.interface';
import { IColumn } from 'src/app/shared/types/column.interface';
import { SocketEventEnum } from 'src/app/shared/types/socketEvents.enum';
import { ITask } from 'src/app/shared/types/task.interface';

@Injectable({
  providedIn: 'root'
})
export class BoardStateService {
  constructor(private socketService: SocketService) {}

  board$ = new BehaviorSubject<IBoard | null>(null);
  columns$ = new BehaviorSubject<IColumn[]>([]);
  tasks$ = new BehaviorSubject<ITask[]>([]);
  setBoard(board: IBoard): void {
    this.board$.next(board);
  }

  setColumns(columns: IColumn[]): void {
    this.columns$.next(columns);
  }
  setTasks(tasks: ITask[]): void {
    this.tasks$.next(tasks);
  }
  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventEnum.boardsLeave, { boardId });
  }

  updateBoard(updatedBoard: IBoard) {
    this.board$.next(updatedBoard);
  }

  addColumn(column: IColumn): void {
    let updatedColumns: IColumn[] = [...this.columns$.getValue(), column];
    this.setColumns(updatedColumns);
  }

  addTask(task: ITask): void {
    let updatedTasks: ITask[] = [...this.tasks$.getValue(), task];
    this.setTasks(updatedTasks);
    console.log('updated tasks :', this.tasks$.getValue());
  }

  updateColumn(updatedColumn: IColumn): void {
    let updatedColumns: IColumn[] = this.columns$.getValue().map((column) => {
      if (column.id === updatedColumn.id) {
        return { ...column, title: updatedColumn.title };
      }
      return column;
    });
    this.setColumns(updatedColumns);
  }

  updateTask(updatedTask: ITask): void {
    let updatedTasks: ITask[] = this.tasks$.getValue().map((task) => {
      if (task.id === updatedTask.id) {
        return {
          ...task,
          title: updatedTask.title,
          description: updatedTask.description,
          columnId: updatedTask.columnId
        };
      }
      return task;
    });
    this.setTasks(updatedTasks);
  }

  deleteColumn(columnId: string): void {
    let updatedColumns: IColumn[] = this.columns$
      .getValue()
      .filter((column) => column.id !== columnId);
    this.setColumns(updatedColumns);
  }

  deleteTask(taskId: string): void {
    let updatedTasks: ITask[] = this.tasks$
      .getValue()
      .filter((task) => task.id !== taskId);
    this.setTasks(updatedTasks);
  }
}
