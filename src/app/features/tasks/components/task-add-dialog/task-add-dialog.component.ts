import { Component, computed, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '@/core/services/alert.service';
import { TaskService } from '@/core/services/task.service';

@Component({
  selector: 'app-task-add-dialog',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-add-dialog.component.html',
  styleUrl: './task-add-dialog.component.scss',
})
export class TaskAddDialogComponent {
  @Input() initialStateId: number = 1;
  @Input() onClose!: () => void;
  @Input() onSave!: (title: string, stateId: number) => void;

  //mostrar el valro q esta llegando de initialStateId
  ngOnInit() {
    console.log(this.initialStateId);
    this.addTaskForm.patchValue({
      stateId: this.initialStateId,
    });
  }

  private alertService = inject(AlertService);
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);

  states = computed(() => this.taskService.getStates());

  addTaskForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(250)]],
    stateId: [this.initialStateId, Validators.required],
  });

  formInvalid = signal(false);

  onSubmit() {
    if (this.addTaskForm.valid) {
      console.log('valie',);
      const { title, stateId } = this.addTaskForm.value;
      this.onSave(title!, Number(stateId));
      this.alertService.showAlert('Tarea añadida correctamente');
    }else if(this.addTaskForm.value.title === ''){
      console.log('no valie', this.addTaskForm);
      this.formInvalid.set(true);
    }
  }

  onCancel() {
    this.onClose();
  }
}
