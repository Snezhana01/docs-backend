import type { UploadTypes } from '../constants/upload-types.enum';

export interface IApiFile {
  name: UploadTypes;
  maxCount: number;
}
