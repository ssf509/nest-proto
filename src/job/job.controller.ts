import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { JobEntity } from './entities/job.entity';
import { AddJobDto } from './dto/Add-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../user/Guards/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../decorators/user.decorator';

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllJobs(@User() user): Promise<JobEntity[]> {
    return await this.jobService.getJobs(user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addJob(@Body() addJobDto: AddJobDto, @User() user): Promise<JobEntity> {
    return await this.jobService.addJob(addJobDto, user);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateJob2(@Body() updateObject, @User() user) {
    const { updateCriteria, updateJobDto } = updateObject;
    return await this.jobService.updateJob2(updateCriteria, updateJobDto);
  }

  @Get('recover/:id')
  @UseGuards(JwtAuthGuard)
  async restoreJob(@Param('id', ParseIntPipe) id: number, @User() user) {
    return await this.jobService.restoreJob(id, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getJob(
    @Param('id', ParseIntPipe) id,
    @User() user,
  ): Promise<JobEntity> {
    return await this.jobService.findJobById(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteJob(@Param('id', ParseIntPipe) id: number, @User() user) {
    return this.jobService.softDeleteJob(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateJob(
    @Body() updateJobDto: UpdateJobDto,
    @Param('id', ParseIntPipe) id: number,
    @User() user,
  ): Promise<JobEntity> {
    return await this.jobService.updateJob(id, updateJobDto, user);
  }
}
