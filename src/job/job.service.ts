import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JobEntity } from './entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddJobDto } from './dto/Add-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UserEntity } from '../user/entites/user.entity';
import { UserRoleEnum } from '../enums/user-role.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private jobRepository: Repository<JobEntity>,
    private userService: UserService,
  ) {}

  async findJobById(id: number, user) {
    const job = await this.jobRepository.findOne(id);
    if (!job) {
      throw new NotFoundException(`Le job d'id ${id} n'existe pas`);
    }
    // Si on est admin ou si on est admin et on a pas de user
    if (this.userService.isOwnerOrAdmin(job, user)) return job;
    else throw new UnauthorizedException();
  }
  async getJobs(user): Promise<JobEntity[]> {
    if (user.role === UserRoleEnum.ADMIN)
      return await this.jobRepository.find();
    return await this.jobRepository.find({ user });
  }

  async addJob(job: AddJobDto, user): Promise<JobEntity> {
    const newJob = this.jobRepository.create(job);
    newJob.user = user;
    return await this.jobRepository.save(newJob);
  }

  async updateJob(id: number, job: UpdateJobDto, user): Promise<JobEntity> {
    //On récupére le job d'id id et ensuite on remplace les anciennes valeurs de ce job
    // par ceux du job passé en paramètre
    const newJob = await this.jobRepository.preload({
      id,
      ...job,
    });
    // tester le cas ou le job d'id id n'existe pas
    if (!newJob) {
      throw new NotFoundException(`Le job d'id ${id} n'existe pas`);
    }
    //sauvgarder la nouvelle entité donc le nouveau job
    if (this.userService.isOwnerOrAdmin(newJob, user))
      return await this.jobRepository.save(newJob);
    else new UnauthorizedException('');
  }

  updateJob2(updateCriteria, job: UpdateJobDto) {
    return this.jobRepository.update(updateCriteria, job);
  }

  // async removeJob(id: number) {
  //   const jobToRemove = await this.findJobById(id);
  //   return await this.jobRepository.remove(jobToRemove);
  // }

  async softDeleteJob(id: number, user) {
    const job = await this.jobRepository.findOne({ id });
    console.log('job', job);
    if (!job) {
      throw new NotFoundException('');
    }
    if (this.userService.isOwnerOrAdmin(job, user))
      return this.jobRepository.softDelete(id);
    else throw new UnauthorizedException('');
  }

  async restoreJob(id: number, user) {
    const job = await this.jobRepository.query(
      'select * from job where id = ?',
      [id],
    );
    if (!job) {
      throw new NotFoundException('');
    }
    if (this.userService.isOwnerOrAdmin(job, user))
      return this.jobRepository.restore(id);
    else throw new UnauthorizedException('');
  }

  async deleteJob(id: number) {
    return await this.jobRepository.delete(id);
  }

  async statJobNumberByAge(maxAge, minAge = 0) {
    // Créer un queryBuilder
    const qb = this.jobRepository.createQueryBuilder('job');
    // Chercher le nombre de job par age
    qb.select('job.age, count(job.id) as nombreDeJob')
      .where('job.age > :minAge and job.Age< :maxAge')
      .setParameters({ minAge, maxAge })
      .groupBy('job.age');
    console.log(qb.getSql());
    return await qb.getRawMany();
  }
}
