import { upload } from '../config/multerConfig.js';

export const uploadSingleImage = upload.single('image');

