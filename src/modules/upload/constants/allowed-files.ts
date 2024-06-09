import type { IApiFile } from '../interfaces/IApiFiles';
import { UploadTypes } from './upload-types.enum';

export const allowedFiles: IApiFile[] = [
  { name: UploadTypes.AVATAR, maxCount: 1 },
];
