import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Task } from './entities/task.entity';
import { GetAllTaskDto } from './dto/get-all-task.dto';
import { AddTaskDto } from './dto/add-task.dto';
import { TaskService } from './task.service';
import { UpperAndFusionPipe } from '../pipes/upper-and-fusion.pipe';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('v2')
  getTasksV2(@Req() request: Request, @Res() response: Response) {
    console.log('Récupérer la liste des tasks');
    response.status(205);
    response.json({
      contenu: `Je suis une réponse générée à partir de l'objet Response de express`,
    });
  }

  // Récupérer la liste des Tasks
  @Get()
  getTasks(@Query() mesQueryParams: GetAllTaskDto): Task[] {
    console.log(mesQueryParams instanceof GetAllTaskDto);
    return this.taskService.getTasks();
  }

  // Récupérer le Task via son Id
  @Get('/:id')
  getTaskById(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
      }),
    )
    id,
  ) {
    return this.taskService.getTaskById(id);
  }

  // Ajouter un Task
  @Post()
  addTask(@Body() newTask: AddTaskDto): Task {
    console.log(newTask);
    return this.taskService.addTask(newTask);
  }

  // Supprimer un Task via son id
  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id) {
    return this.taskService.deleteTask(id);
  }

  @Put(':id')
  modifierTask(
    @Param('id', ParseIntPipe) id,
    @Body() newTask: Partial<AddTaskDto>,
  ) {
    return this.taskService.updateTask(id, newTask);
  }

  @Post('pipe')
  testPipe(@Param('data', UpperAndFusionPipe) paramData, @Body() data) {
    return data;
  }
}
