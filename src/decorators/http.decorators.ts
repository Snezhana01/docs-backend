import type { PipeTransform, Type } from '@nestjs/common';
import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  SetMetadata,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import type { RoleType } from '../constants';
import { RoleTypeSwagger } from '../constants/role-type-swagger';
import { AuthExceptionFilter } from '../filters/auth-exception.filter';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(roles: RoleType[] = [], summary: string): MethodDecorator {
  const additionSummaryRoles = roles
    .map((role) => RoleTypeSwagger[role])
    .join(' | ');

  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard(), RolesGuard),
    ApiOperation({
      summary: `${summary} 🔒 Роли: ${additionSummaryRoles}`,
    }),
    ApiBearerAuth('JWT-auth'),
    ApiUnauthorizedResponse({ description: 'auth.unauthorized' }),
    ApiForbiddenResponse({ description: 'auth.forbidden' }),
    UseFilters(AuthExceptionFilter),
  );
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe(), ...pipes);
}
