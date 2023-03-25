import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { combineLatest, filter, map, Observable, Subscription } from 'rxjs';
import { BoardsService } from '../shared/services/boards.service';
import { ColumnService } from '../shared/services/columns.service';
import { SocketService } from '../shared/services/socket.service';
import { IBoard } from '../shared/types/board.interface';
import { IColumn } from '../shared/types/column.interface';
import { SocketEventEnum } from '../shared/types/socketEvents.enum';
import { BoardService } from './services/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html'
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string;
  routerSub: Subscription | undefined;
  data$: Observable<{
    board: IBoard;
    columns: IColumn[];
  }>;
  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private SocketService: SocketService,
    private columnService: ColumnService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error(`Can't get boardId from url`);
    }
    this.boardId = boardId;

    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$
    ]).pipe(
      map(([board, columns]) => ({
        board,
        columns
      }))
    );
  }

  ngOnInit(): void {
    this.SocketService.emit(SocketEventEnum.boardsJoin, {
      boardId: this.boardId
    });
    this.fetchData();
    this.initializeListeners();
  }
  private initializeListeners() {
    this.routerSub = this.router.events.subscribe((event) => {
      console.log(event);
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    });
  }

  private fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
      this.boardService.setBoard(board);
      this.columnService.getColumns(this.boardId).subscribe((columns) => {
        this.boardService.setColumns(columns);
      });
    });
  }

  test(): void {
    this.SocketService.emit(SocketEventEnum.columnCreate, {
      boardId: this.boardId,
      title: 'foo'
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
