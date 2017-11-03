import { Router } from 'express';

import { getPhotos } from './photos';
import { getSessions, createSession, editSession, deleteSession } from './sessions';

const router = Router();

router
  .get('/api/photos', getPhotos);

router
  .get('/api/sessions', getSessions)
  .post('/api/sessions', createSession)
  .put('/api/sessions/:id', editSession)
  .delete('/api/sessions/:id', deleteSession);

export default router;