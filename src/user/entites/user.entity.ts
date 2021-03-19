import { OneToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntities } from '../../utils/timestamp.entities';
import { JobEntity } from '../../job/entities/job.entity';
import { UserRoleEnum } from '../../enums/user-role.enum';

@Entity('user')
export class UserEntity extends TimestampEntities{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    unique: true
  })
  username: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER
  })
  role: string;

  @OneToMany(
    type => JobEntity,
    (job) => job.user,
    {
      nullable: true,
      cascade: true
    }
  )
  jobs: JobEntity[];
}
