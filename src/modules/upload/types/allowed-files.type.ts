import type { UploadTypes } from '../constants/upload-types.enum';

export type AllowedFiles = {
  [key in keyof typeof UploadTypes]?: Express.MulterS3.File[];
};
