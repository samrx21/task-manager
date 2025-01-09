import { computed, Injectable, signal } from '@angular/core';
import { Task, State } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = signal<Task[]>([]);
  private states = signal<State[]>([
    { id: 1, name: 'Pendiente', order: 1 },
    { id: 2, name: 'En proceso', order: 2 },
    { id: 3, name: 'Finalizado', order: 3 },
  ]);

  constructor() {
    this.initializeTestTasks();
  }

  private initializeTestTasks() {
    this.tasks.set([
      {
        id: '1',
        title: 'Tarea 1',
        stateId: 1,
      },
      {
        id: '2',
        title: 'Tarea 2',
        stateId: 1,
      },
      {
        id: '3',
        title: 'Tarea 3',
        stateId: 2,
      },
      {
        id: '4',
        title: 'Tarea 4',
        stateId: 3,
      },
    ]);
  }

  tasksByState = computed(() => {
    const taskMap = new Map<number, Task[]>();

    // Inicializamos el map con arrays vacíos para cada estado
    this.states().forEach((state) => {
      taskMap.set(state.id, []);
    });

    // Agrupamos las tareas por su stateId
    this.tasks().forEach((task) => {
      const tasksForState = taskMap.get(task.stateId) || [];
      tasksForState.push(task);
      taskMap.set(task.stateId, tasksForState);
    });

    return taskMap;
  });

  addTask(title: string, state:number): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      stateId: state,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  updateTask(taskId: string, title: string) {
    this.tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, title, updatedAt: new Date() } : task
      )
    );
  }

  getAllTasks(): Task[] {
    return this.tasks();
  }

  deleteTask(taskId: string): void {
    const updatedTasks = this.tasks().filter((task) => task.id !== taskId);
    this.tasks.set(updatedTasks);
  }

  addState(name: string) {
    const currentStates = this.states();
    const newState: State = {
      id: Math.max(...currentStates.map((s) => s.id)) + 1,
      name,
      order: currentStates.length + 1,
    };
    this.states.update((states) => [...states, newState]);
  }

  deleteState(stateId: number) {
    const tasksInState = this.tasks().some((task) => task.stateId === stateId);
    if (tasksInState) {
      throw new Error('No se puede eliminar un estado que contiene tareas');
    }
    this.states.update((states) =>
      states.filter((state) => state.id !== stateId)
    );
  }

  updateTaskState(taskId: string, newStateId: number): void {
    const tasks = this.tasks();
    const states = this.states();

    // Validar que el estado siguiente sea válido
    const task = tasks.find((t) => t.id === taskId);
    const currentState = states.find((s) => s.id === task?.stateId);
    const newState = states.find((s) => s.id === newStateId);

    if (
      !task ||
      !currentState ||
      !newState ||
      newState.order !== currentState.order + 1
    ) {
      return;
    }
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, stateId: newStateId, updatedAt: new Date() } : t
    );

    this.tasks.set(updatedTasks);
  }

  getStates(): State[] {
    return this.states();
  }

  //manejo de papelera
  private trash = signal<Task[]>([]);
  
  getTasksInTrash(): Task[] {
    return this.trash();
  }

  deleteTaskToTrash(taskId: string): void {
    const task = this.tasks().find((task) => task.id === taskId);
    if (task) {
      this.trash.update((tasks) => [...tasks, task]);
      this.deleteTask(taskId);
    }
  }

  //restaurar tarea
  restoreTask(taskId: string): void {
    const task = this.trash().find((task) => task.id === taskId);
    if (task) {
      this.tasks.update((tasks) => [...tasks, task]);
      this.trash.update((tasks) => tasks.filter((t) => t.id !== taskId));
    }
  }

  //eliminar tarea de forma permanente
  deleteTaskFromTrash(taskId: string): void {
    this.trash.update((tasks) => tasks.filter((t) => t.id !== taskId));
  }

  //vaciar papelera
  emptyTrash(): void {
    this.trash.set([]);
  }

}
