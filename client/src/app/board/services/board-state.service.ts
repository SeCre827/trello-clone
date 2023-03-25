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

  addColumn(column: IColumn): void {
    let updatedColumns: IColumn[] = [...this.columns$.getValue(), column];
    this.setColumns(updatedColumns);
  }
}
