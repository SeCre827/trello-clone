import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';
import { NavbarModule } from '../shared/modules/navbar/navbar.module';
import { InlineFormModule } from '../shared/modules/inlineForm/inline-form.module';
import { BoardComponent } from './components/board/board.component';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'boards/:boardId',
    component: BoardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskModalComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NavbarModule,
    InlineFormModule,
    ReactiveFormsModule
  ],
  declarations: [BoardComponent, TaskModalComponent]
})
export class BoardModule {}
