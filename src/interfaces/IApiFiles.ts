import type { UploadTypes } from '@modules/upload/constants/upload-types.enum';

export interface IApiFiles {
  name: UploadTypes;
  isArray?: boolean;
  maxCount: number;
}
