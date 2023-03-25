import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  combineLatest,
  filter,
  map,
  Observable,
  Subscription,
  tap
} from 'rxjs';
import { BoardsService } from '../shared/services/boards.service';
import { ColumnService } from '../shared/services/columns.service';
import { SocketService } from '../shared/services/socket.service';
import { TaskService } from '../shared/services/tasks.service';
import { IBoard } from '../shared/types/board.interface';
import { IColumn } from '../shared/types/column.interface';
import { IColumnRequest } from '../shared/types/columnRequest.interface';
import { SocketEventEnum } from '../shared/types/socketEvents.enum';
import { ITask } from '../shared/types/task.interface';
import { BoardStateService } from './services/board-state.service';

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
    tasks: ITask[];
  }>;
  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router,
    private boardStateService: BoardStateService,
    private SocketService: SocketService,
    private columnService: ColumnService,
    private taskService: TaskService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error(`Can't get boardId from url`);
    }
    this.boardId = boardId;

    this.data$ = combineLatest([
      this.boardStateService.board$.pipe(filter(Boolean)),
      this.boardStateService.columns$,
      this.boardStateService.tasks$
    ]).pipe(
      map(([board, columns, tasks]) => ({
        board,
        columns,
        tasks
      })),
      tap((data) => console.log(data))
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
      if (event instanceof NavigationStart) {
        this.boardStateService.leaveBoard(this.boardId);
      }
    });
    this.SocketService.listen<IColumn>(
      SocketEventEnum.columnCreateSucess
    ).subscribe((column) => {
      this.boardStateService.addColumn(column);
    });
  }

  private fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
      this.boardStateService.setBoard(board);
    });
    this.columnService.getColumns(this.boardId).subscribe((columns) => {
      this.boardStateService.setColumns(columns);
    });
    this.taskService.getTasks(this.boardId).subscribe((tasks) => {
      this.boardStateService.setTasks(tasks);
    });
  }

  test(): void {
    this.SocketService.emit(SocketEventEnum.columnCreate, {
      boardId: this.boardId,
      title: 'foo'
    });
  }

  createColumn(title: string) {
    const columInput: IColumnRequest = {
      title,
      boardId: this.boardId
    };
    this.columnService.createColumn(columInput);
    console.log('create column: ', title);
  }

  getTasksByColumn(columnId: string, tasks: ITask[]): ITask[] {
    return tasks.filter((task) => task.columnId === columnId);
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
