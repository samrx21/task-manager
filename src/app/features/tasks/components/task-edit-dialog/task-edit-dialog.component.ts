import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Task } from '@/core/models';
import { TaskService } from '@/core/services/task.service';

@Component({
  selector: 'app-task-edit-dialog',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-edit-dialog.component.html',
  styleUrl: './task-edit-dialog.component.scss',
})
export class TaskEditDialogComponent {
  @Input() task!: Task;
  @Input() onClose!: () => void;
  @Input() onSave!: (title: string) => void;

  private fb = inject(FormBuilder);

  editTaskForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(250)]],
  });

  ngOnInit() {
    this.editTaskForm.patchValue({
      title: this.task.title,
    });
  }

  onSubmit() {
    if (this.editTaskForm.valid) {
      this.onSave(this.editTaskForm.value.title!);
      this.onClose();
    }
  }

  onCancel() {
    this.onClose();
  }
}
