import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '@/core/services/task.service';
import { State, Task } from '@/core/models';
import { AlertService } from '@/core/services/alert.service';
import { TaskAddDialogComponent } from '@/features/tasks/components/task-add-dialog/task-add-dialog.component';
import { TaskEditDialogComponent } from '@/features/tasks/components/task-edit-dialog/task-edit-dialog.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [CommonModule,FormsModule, TaskAddDialogComponent, TaskEditDialogComponent],
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.scss',
})
export class TaskTableComponent {
  private taskService = inject(TaskService);
  private alertService = inject(AlertService);

  tasks = computed(() => this.taskService.getAllTasks());
  states = computed(() => this.taskService.getStates());

  getStateName(stateId: number): string {
    return this.states()?.find((state) => state.id === stateId)?.name || '';
  }

  getNextValidStates(currentStateId: number): State[] {
    const currentState = this.states()?.find(
      (state) => state.id === currentStateId
    );
    if (!currentState) return [];

    return (
      this.states()?.filter(
        (state) => state.order === currentState.order + 1
      ) || []
    );
  }

  onStateChange(taskId: string, event: Event) {
    const newStateId = parseInt((event.target as HTMLSelectElement).value, 10);
    try {
      this.taskService.updateTaskState(taskId, newStateId);
      this.alertService.showAlert('Estado de tarea actualizado correctamente');
    } catch (error: any) {
      this.alertService.showAlert(error.message, 'error');
    }
  }

  onDelete(taskId: string) {
    this.taskService.deleteTaskToTrash(taskId);
    this.alertService.showAlert('Tarea eliminada, puedes verla en la papelera');
  }

  stateOfAddTask = signal<number>(1);
  showAddTaskDialog = signal(false);

  onAddTask(stateId: number) {
    this.stateOfAddTask.set(stateId);
    this.showAddTaskDialog.set(true);
  }

  closeAddTaskDialog = () => {
    this.showAddTaskDialog.set(false);
  };

  saveAddTask = (title: string, stateId: number) => {
    this.taskService.addTask(title, stateId);
    this.closeAddTaskDialog();
  };

  showEditTaskDialog = signal(false);
  taskToEdit = signal<Task | null>(null);

  onEdit(task: Task) {
    this.taskToEdit.set(task);
    this.showEditTaskDialog.set(true);
  }

  saveEditTask = (title: string) => {
    if (this.taskToEdit()) {
      this.taskService.updateTask(this.taskToEdit()!.id, title);
      this.alertService.showAlert('Título actualizado correctamente');
    }
    this.closeEditTaskDialog();
  };

  closeEditTaskDialog = () => {
    this.showEditTaskDialog.set(false);
    this.taskToEdit.set(null);
  };
}
