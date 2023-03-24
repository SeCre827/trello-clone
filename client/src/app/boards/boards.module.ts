import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsComponent } from './boards.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';
import { InlineFormModule } from '../shared/modules/inlineForm/inline-form.module';

const routes: Routes = [
  {
    path: 'boards',
    component: BoardsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), InlineFormModule],
  declarations: [BoardsComponent]
})
export class BoardsModule {}
