import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskService } from '@/core/services/task.service';
import { AlertService } from '@/core/services/alert.service';
import { Task } from '@/core/models';
import { TaskAddDialogComponent } from '@/features/tasks/components/task-add-dialog/task-add-dialog.component';
import { TaskEditDialogComponent } from '@/features/tasks/components/task-edit-dialog/task-edit-dialog.component';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    TaskAddDialogComponent,
    TaskEditDialogComponent,
  ],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss',
})
export class TaskBoardComponent {
  private taskService = inject(TaskService);
  private alertService = inject(AlertService);

  states = computed(() => this.taskService.getStates());
  tasksByState = this.taskService.tasksByState;
  title: any;

  getConnectedLists(currentStateId: number): string[] {
    // Obtener todos los estados
    const states = this.states();
    // Encontrar el índice del estado actual
    const currentIndex = states.findIndex((s) => s.id === currentStateId);

    // Si es el último estado, no puede moverse a ningún lado
    if (currentIndex === states.length - 1) {
      return [];
    }

    // Retornar solo el ID del siguiente estado
    const nextState = states[currentIndex + 1];
    return [`state-${nextState.id}`];
  }

  onDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      return;
    }

    const task = event.previousContainer.data[event.previousIndex];
    const newStateId = parseInt(event.container.id.split('-')[1]);

    this.taskService.updateTaskState(task.id, newStateId);
  }

  onDelete(taskId: string) {
    this.taskService.deleteTaskToTrash(taskId);
    this.alertService.showAlert('Tarea eliminada, puedes verla en la papelera');
  }

  showAddTaskDialog = signal(false);
  stateOfAddTask = signal<number>(1);

  onAddTask(stateId: number) {
    this.stateOfAddTask.set(stateId);
    this.showAddTaskDialog.set(true);
  }

  saveAddTask = (title: string, stateId: number) => {
    this.taskService.addTask(title, stateId);
    this.closeAddTaskDialog();
  };

  closeAddTaskDialog = () => {
    this.showAddTaskDialog.set(false);
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
