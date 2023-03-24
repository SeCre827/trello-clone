import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from 'src/app/shared/services/socket.service';
import { IBoard } from 'src/app/shared/types/board.interface';
import { SocketEventEnum } from 'src/app/shared/types/socketEvents.enum';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor(private socketService: SocketService) {}

  board$ = new BehaviorSubject<IBoard | null>(null);
  setBoard(board: IBoard): void {
    this.board$.next(board);
  }
  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventEnum.boardsLeave, { boardId });
  }
}
