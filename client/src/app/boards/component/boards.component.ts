import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { IBoard } from 'src/app/shared/types/board.interface';

@Component({
  selector: 'boards',
  templateUrl: './boards.component.html'
})
export class BoardsComponent implements OnInit, OnDestroy {
  boardsSub: Subscription | undefined;
  boards: IBoard[] = [];

  constructor(private boardsService: BoardsService) {}
  ngOnInit(): void {
    this.boardsService.getBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }

  createBoard(title: string): void {
    this.boardsService.createBoard(title).subscribe((createdBoard) => {
      this.boards = [...this.boards, createdBoard];
    });
  }

  ngOnDestroy(): void {
    if (this.boardsSub) {
      this.boardsSub.unsubscribe();
    }
  }
}
