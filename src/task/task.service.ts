import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { AddTaskDto } from './dto/add-task.dto';

@Injectable()
export class TaskService {
  tasks: Task[] = [];

  getTasks(): Task[] {
    return this.tasks;
  }
  addTask(newTask: AddTaskDto): Task {
    const { name, description } = newTask;
    let id;
    if (this.tasks.length) {
      id = this.tasks[this.tasks.length - 1].id + 1;
    } else {
      id = 1;
    }

    const task = {
      id,
      name,
      description,
      createdAt: new Date(),
    };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: number): Task {
    const task = this.tasks.find((actualTask) => actualTask.id === id);
    if (task) return task;
    throw new NotFoundException(`Le task d'id ${id} n'existe pas`);
  }

  deleteTask(id: number) {
    // Chercher l'objet via son id dans le tableau des tasks
    const index = this.tasks.findIndex((task) => task.id === +id);
    // Utiliser la méthode splice pour supprimer le task s'il existe
    if (index >= 0) {
      this.tasks.splice(index, 1);
    } else {
      throw new NotFoundException(`Le task d'id ${id} n'existe pas`);
    }
    // Sinon je vais déclencher une erreur
    return {
      message: `Le task d'id ${id} a été supprimé avec suucès`,
      count: 1,
    };
  }

  updateTask(id: number, newTask: Partial<Task>) {
    const task = this.getTaskById(id);
    task.description = newTask.description
      ? newTask.description
      : task.description;
    task.name = newTask.name ? newTask.name : task.name;
    return task;
  }
}
