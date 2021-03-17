import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Task } from './entities/task.entity';
import { findIndex } from 'rxjs/operators';

@Controller('task')
export class TaskController {
  constructor() {
    this.tasks = [];
  }
  tasks: Task[];

  @Get('v2')
  getTasksV2(@Req() request: Request, @Res() response: Response) {
    console.log('Récupérer la liste des task');
    response.status(205);
    response.json({
      contenu: `Je suis une réponse générée pour tester le retour `,
    });
  }
  @Get()
  getTasks(@Query() mesQueryParams) {
    console.log(mesQueryParams);
    return this.tasks;
  }

  @Get('/:id')
  getTaskById(@Param('id') id) {
    const task = this.tasks.find((actualTask) => actualTask.id === +id);
    if (task) return task;
    throw new NotFoundException(`La task d'id ${id} n'existe pas`);
  }

  @Post()
  addTask(@Body() newTask: Task) {
    if (this.tasks.length) {
      newTask.id = this.tasks[this.tasks.length - 1].id + 1;
    } else {
      newTask.id = 1;
    }
    this.tasks.push(newTask);
    return newTask;
  }

  @Delete(':id')
  deleteTasks(@Param('id') id) {
    const index = this.tasks.findIndex((todo) => todo.id === +id);
    if (index >= 0) {
      this.tasks.splice(index, 1);
    } else {
      throw new NotFoundException(`la task ${id} n'existe pas`);
    }
    console.log('supprimer de la liste des task');
    return {
      message: `la task ${id} a bien été supprimé`,
      count: 1,
    };
  }

  @Put(':id')
  modifierTask(
    @Param('id') id,
    @Body() newTask: Partial<Task>
  ) {
    const task = this.getTaskById(id);
    task.description = newTask.description? newTask.description : task.description;
    task.name = newTask.name? newTask.name : task.name;
    return task;
  }
}
