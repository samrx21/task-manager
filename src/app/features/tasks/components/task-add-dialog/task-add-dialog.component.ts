import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Task } from '@/core/models';

@Component({
  selector: 'app-task-add-dialog',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-add-dialog.component.html',
  styleUrl: './task-add-dialog.component.scss',
})
export class TaskAddDialogComponent {
  @Input() stateId!: number;
  @Input() onClose!: () => void;
  @Input() onSave!: (title: string, stateId: number) => void;

  private fb = inject(FormBuilder);

  addTaskForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(250)]],
  });

  onSubmit() {
    if (this.addTaskForm.valid) {
      this.onSave(this.addTaskForm.value.title!, this.stateId);
      this.onClose();
    }
  }

  onCancel() {
    this.onClose();
  }
}
