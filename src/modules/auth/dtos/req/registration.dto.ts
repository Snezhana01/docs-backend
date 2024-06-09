import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegistrationDto {
  @ApiProperty()
  @MinLength(4)
  @MaxLength(16)
  @IsString()
  readonly login: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}
