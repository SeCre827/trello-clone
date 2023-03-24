import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';
import { InlineFormModule } from '../shared/modules/inlineForm/inline-form.module';
import { NavbarModule } from '../shared/modules/navbar/navbar.module';
import { BoardsComponent } from './component/boards.component';

const routes: Routes = [
  {
    path: 'boards',
    component: BoardsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InlineFormModule,
    NavbarModule
  ],
  declarations: [BoardsComponent]
})
export class BoardsModule {}
