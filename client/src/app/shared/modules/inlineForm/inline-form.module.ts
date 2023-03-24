import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineFormComponent } from './components/inline-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InlineFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [InlineFormComponent]
})
export class InlineFormModule {}
