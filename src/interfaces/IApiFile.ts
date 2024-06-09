import type { UploadTypes } from '@modules/upload/constants/upload-types.enum';

export interface IApiFile {
  name: UploadTypes;
  isArray?: boolean;
}
