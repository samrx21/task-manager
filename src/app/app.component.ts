import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskBoardComponent } from '@/features/tasks/components/task-board/task-board.component';
import { TaskService } from '@/core/services/task.service';
import { AlertService } from '@/core/services/alert.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskTableComponent } from '@/features/tasks/components/task-table/task-table.component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TaskBoardComponent,
    CommonModule,
    ReactiveFormsModule,
    TaskTableComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private taskService = inject(TaskService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);
  showBoardTasks = signal(true);

  changeView() {
    this.showBoardTasks.set(!this.showBoardTasks());
  }

  showStatesMenu = signal(false);
  states = computed(() => this.taskService.getStates());

  alerts = this.alertService.getAlerts();

  addStateForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(25)]],
  });

  toggleStatesMenu() {
    this.showStatesMenu.set(!this.showStatesMenu());
  }

  onDeleteState(stateId: number) {
    try {
      this.taskService.deleteState(stateId);
      this.alertService.showAlert('Estado eliminado correctamente');
    } catch (error: any) {
      this.alertService.showAlert(error.message, 'error');
    }
  }

  onSubmit() {
    if (this.addStateForm.valid) {
      this.taskService.addState(this.addStateForm.value.name!);
      this.alertService.showAlert('Estado añadido correctamente');
      this.addStateForm.reset();
      this.toggleStatesMenu();
    }
  }

  showTrash = signal(false);
  taskInTrash = computed(() => this.taskService.getTasksInTrash());

  toggleTrash() {
    this.showTrash.set(!this.showTrash());
  }

  onRestore(taskId: string) {
    this.taskService.restoreTask(taskId);
    this.alertService.showAlert('Tarea restaurada correctamente');
  }

  onDeleteFromTrash(taskId: string) {
    this.taskService.deleteTaskFromTrash(taskId);
    this.alertService.showAlert('Tarea eliminada Permanentemente');
  }

  onEmptyTrash() {
    this.taskService.emptyTrash();
    this.alertService.showAlert('Papelera vaciada correctamente');
  }
}
