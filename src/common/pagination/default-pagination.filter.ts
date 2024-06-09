import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';

import { Order } from '../../constants/order-dir';

export class DefaultPaginationFilter {
  @ApiPropertyOptional({
    default: 50,
    description: 'Количество, которое необходимо получить',
  })
  @Min(0)
  @Max(50)
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  readonly take?: number = 50;

  @ApiPropertyOptional({
    default: 0,
    description: 'Количество, которое необходимо пропустить',
  })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  readonly skip?: number = 0;

  @ApiPropertyOptional({
    enum: Object.values(Order),
    default: 'ASC',
    description: 'Направление сортировки',
  })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;
}
