import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddJobDto {

  @IsNotEmpty()
  @IsString()
  name: string;


  @IsNotEmpty()
  @IsString()
  job: string;

}
