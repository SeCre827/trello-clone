import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter, Observable, Subscription } from 'rxjs';
import { BoardsService } from '../shared/services/boards.service';
import { SocketService } from '../shared/services/socket.service';
import { IBoard } from '../shared/types/board.interface';
import { SocketEventEnum } from '../shared/types/socketEvents.enum';
import { BoardService } from './services/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html'
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string;
  routerSub: Subscription | undefined;
  board$: Observable<IBoard>;
  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private SocketService: SocketService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error(`Can't get boardId from url`);
    }
    this.boardId = boardId;
    this.board$ = this.boardService.board$.pipe(filter(Boolean));
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
    });
  }
  ngOnDestroy(): void {
    if (this.routerSub){
      this.routerSub.unsubscribe();
    }
  }
}
