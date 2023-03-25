import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { InlineFormButtonInputType } from 'src/app/shared/types/InlineFormButtonInputType.enum';

@Component({
  selector: 'inline-form',
  templateUrl: './inline-form.component.html'
})
export class InlineFormComponent {
  @Input() title: string = '';
  @Input() defaultText: string = 'Not defined';
  @Input() hasButton: boolean = false;
  @Input() buttonText: string = 'Submit';
  @Input() inputPlaceholder: string = '';
  @Input() inputType: string = InlineFormButtonInputType.Input;
  @Output() handleSubmit = new EventEmitter<string>();

  isEditing: boolean = false;
  form = this.fb.group({
    title: ['']
  });

  constructor(private fb: FormBuilder) {}

  activeEditing(): void {
    if (this.title) {
      this.form.patchValue({ title: this.title });
    }
    this.isEditing = true;
  }

  onCancel(e: Event): void {
    e.stopPropagation();
    this.isEditing = false;
  }

  onSubmit(): void {
    if (this.form.value.title) {
      this.handleSubmit.emit(this.form.value.title);
    }
    this.isEditing = false;
    this.form.reset();
  }
}
