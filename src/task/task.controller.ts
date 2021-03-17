import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Task } from './entities/task.entity';

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
  getTasks(
    @Query() mesQueryParams
  ) {
    console.log(mesQueryParams);
    return this.tasks;
  }

  @Get('/:id')
  getTaskById(
    @Param('id') id
  ) {
    const task = this.tasks.find((actualTask) => actualTask.id === +id);
    if (task)
      return task;
    throw new NotFoundException(`La task d'id ${id} n'existe pas`);
  }

  @Post()
  addTask(
    @Body() newTask: Task
  ) {
    if (this.tasks.length) {
      newTask.id = this.tasks[this.tasks.length - 1].id + 1;
    } else {
      newTask.id = 1;
    }
    this.tasks.push(newTask);
    return newTask;
  }

  @Delete()
  deleteTasks() {
    console.log('supprimer de la liste des task');
    return 'supprimer une TASK';
  }

  @Put()
  modifierTask() {
    console.log('modifie la liste des task');
    return 'modifier la TASK';
  }
}
