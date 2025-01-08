import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TaskBoardComponent} from '@/features/tasks/components/task-board/task-board.component';
import { TaskService } from '@/core/services/task.service';
import { ReactiveFormsModule,FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TaskBoardComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);

  showStatesMenu = signal(false);
  states = computed(() => this.taskService.getStates());

  addStateForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
  });

  toggleStatesMenu() {
    this.showStatesMenu.set(!this.showStatesMenu());
  }

  onDeleteState(stateId: number) {
    this.taskService.deleteState(stateId);
  }

  onSubmit() {
    if (this.addStateForm.valid) {
      this.taskService.addState(this.addStateForm.value.name!);
      this.addStateForm.reset();
    }
  }
}
