import type { RoleType } from '../../../constants';

export interface IAuthPayload {
  readonly id: string;
  readonly role: RoleType;
}
