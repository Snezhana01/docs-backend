import type { UploadTypes } from './upload-types.enum';

export const uploadFormats: Record<UploadTypes, string> = {
  AVATAR: '.jpg,.jpeg,.png,.heic,.heif',
};
