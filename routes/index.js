import { Router } from 'express';

import { getPhotos } from './photos';

const router = Router();

router
  .get('/photos', getPhotos);

export default router;