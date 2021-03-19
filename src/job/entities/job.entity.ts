import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TimestampEntities } from '../../utils/timestamp.entities';
import { UserEntity } from '../../user/entites/user.entity';

@Entity('job')
export class JobEntity extends TimestampEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    length: 50,
  })
  name: string;

  @Column()
  description: string;

  @ManyToOne((type) => UserEntity, (user) => user.jobs, {
    cascade: ['insert', 'update'],
    nullable: true,
    eager: true,
  })
  user: UserEntity;
}
