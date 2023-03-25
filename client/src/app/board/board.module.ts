import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';
import { NavbarModule } from '../shared/modules/navbar/navbar.module';
import { InlineFormModule } from '../shared/modules/inlineForm/inline-form.module';

const routes: Routes = [
  {
    path: 'boards/:boardId',
    component: BoardComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NavbarModule,
    InlineFormModule
  ],
  declarations: [BoardComponent]
})
export class BoardModule {}
