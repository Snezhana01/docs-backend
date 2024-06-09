import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly genre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly annotations: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly authorPreferences: string;
}
