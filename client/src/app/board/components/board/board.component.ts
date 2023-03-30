import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  Subscription,
  takeUntil,
  tap
} from 'rxjs';
import { BoardsService } from '../../../shared/services/boards.service';
import { ColumnService } from '../../../shared/services/columns.service';
import { SocketService } from '../../../shared/services/socket.service';
import { TaskService } from '../../../shared/services/tasks.service';
import { IBoard } from '../../../shared/types/board.interface';
import { IColumn } from '../../../shared/types/column.interface';
import { IColumnRequest } from '../../../shared/types/columnRequest.interface';
import { SocketEventEnum } from '../../../shared/types/socketEvents.enum';
import { ITask } from '../../../shared/types/task.interface';
import { ITaskRequest } from '../../../shared/types/taskRequest.interface';
import { BoardStateService } from '../../services/board-state.service';

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
  unsubscribe$ = new Subject<void>();
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
    this.SocketService.listen<IColumn>(SocketEventEnum.columnsCreateSucess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((column) => {
        this.boardStateService.addColumn(column);
      });

    this.SocketService.listen<ITask>(SocketEventEnum.tasksCreateSucess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((task) => {
        this.boardStateService.addTask(task);
      });

    this.SocketService.listen<IBoard>(SocketEventEnum.boardsUpdateSucess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedBoard) => {
        this.boardStateService.updateBoard(updatedBoard);
      });

    this.SocketService.listen<void>(SocketEventEnum.boardsDeleteSucess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.router.navigateByUrl('/boards');
      });

    this.SocketService.listen<string>(SocketEventEnum.columnsDeleteSucess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((columnId) => {
        this.boardStateService.deleteColumn(columnId);
      });

    this.SocketService.listen<IColumn>(SocketEventEnum.columnsUpdateSucess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedColumn) => {
        this.boardStateService.updateColumn(updatedColumn);
      });

    this.SocketService.listen<ITask>(SocketEventEnum.tasksUpdateSucess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedTask) => {
        this.boardStateService.updateTask(updatedTask);
      });

    this.SocketService.listen<string>(SocketEventEnum.tasksDeleteSucess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((taskId) => this.boardStateService.deleteTask(taskId));
  }

  private fetchData(): void {
    this.boardsService
      .getBoard(this.boardId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((board) => {
        this.boardStateService.setBoard(board);
      });
    this.columnService
      .getColumns(this.boardId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((columns) => {
        this.boardStateService.setColumns(columns);
      });
    this.taskService
      .getTasks(this.boardId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((tasks) => {
        this.boardStateService.setTasks(tasks);
      });
  }

  createColumn(title: string) {
    const columInput: IColumnRequest = {
      title,
      boardId: this.boardId
    };
    this.columnService.createColumn(columInput);
  }

  createTask(title: string, columnId: string) {
    const taskInput: ITaskRequest = {
      title,
      boardId: this.boardId,
      columnId: columnId
    };
    this.taskService.createTask(taskInput);
  }

  getTasksByColumn(columnId: string, tasks: ITask[]): ITask[] {
    return tasks.filter((task) => task.columnId === columnId);
  }

  updateBoardName(boardName: string): void {
    this.boardsService.updateBoard(this.boardId, { title: boardName });
  }

  deleteBoard(): void {
    if (confirm('Are you sure you want to delete this board?')) {
      this.boardsService.deleteBoard(this.boardId);
    }
  }

  deleteColumn(columnId: string): void {
    if (confirm('Are you sure you want to delete this column?')) {
      this.columnService.deleteColumn(this.boardId, columnId);
    }
  }

  updateColumnName(columnName: string, columnId: string): void {
    this.columnService.updateColumn(this.boardId, columnId, {
      title: columnName
    });
  }

  openTask(taskId: string): void {
    this.router.navigate(['tasks', taskId], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.boardStateService.leaveBoard(this.boardId);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
