import { Component, HostBinding, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil
} from 'rxjs';
import { SocketService } from 'src/app/shared/services/socket.service';
import { TaskService } from 'src/app/shared/services/tasks.service';
import { IColumn } from 'src/app/shared/types/column.interface';
import { SocketEventEnum } from 'src/app/shared/types/socketEvents.enum';
import { ITask } from 'src/app/shared/types/task.interface';
import { BoardStateService } from '../../services/board-state.service';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html'
})
export class TaskModalComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';

  boardId: string;
  taskId: string;
  task$: Observable<ITask>;
  data$: Observable<{ task: ITask; columns: IColumn[] }>;
  columnForm = this.fb.group<{ columnId: FormControl<string | null> }>({
    columnId: new FormControl(null)
  });
  unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private boardStateService: BoardStateService,
    private tasksService: TaskService,
    private socketService: SocketService
  ) {
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!boardId) {
      throw new Error(`Can't get boardID from URL`);
    }

    if (!taskId) {
      throw new Error(`Can't get taskId from URL`);
    }

    this.taskId = taskId;
    this.boardId = boardId;
    this.task$ = this.boardStateService.tasks$.pipe(
      map((tasks) => tasks.find((task) => task.id === this.taskId)),
      filter(Boolean)
    );

    this.data$ = combineLatest([
      this.task$,
      this.boardStateService.columns$
    ]).pipe(map(([task, columns]) => ({ task, columns })));

    this.task$.pipe(takeUntil(this.unsubscribe$)).subscribe((task) => {
      this.columnForm.patchValue({ columnId: task.columnId });
    });

    combineLatest([this.task$, this.columnForm.get('columnId')!.valueChanges])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([task, columnId]) => {
        if (task.columnId !== columnId) {
          if (!columnId) {
            throw new Error('no column specified');
          }
          this.tasksService.updateTask(this.boardId, taskId, { columnId });
        }
        console.log('changed columniD', columnId, task.columnId);
      });

    this.socketService
      .listen<string>(SocketEventEnum.tasksDeleteSucess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.goToBoard());
  }

  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);
    console.log('first');
  }

  updateTaskName(taskName: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      title: taskName
    });
    console.log('updateTaskName ', taskName);
  }

  updateTaskDescription(taskDescription: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      description: taskDescription
    });
    console.log('updateTaskDescription ', taskDescription);
  }

  deleteTask(): void {
    this.tasksService.deleteTask(this.boardId, this.taskId);
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
