import { Router } from 'express';

import { getPhotos, createPhoto, editPhoto, deletePhoto } from './photos';
import {
  getSessions,
  getSessionById,
  createSession,
  editSession,
  deleteSession,
} from './sessions';
import {
  getCategories,
  getCategoryById,
  createCategory,
  editCategory,
  deleteCategory,
} from './categories';

const router = Router();

router
  .get('/api/photos', getPhotos)
  .post('/api/photos', createPhoto)
  .put('/api/photos/:id', editPhoto)
  .delete('/api/photos/:id', deletePhoto);

router
  .get('/api/sessions', getSessions)
  .get('/api/sessions/:id', getSessionById)
  .post('/api/sessions', createSession)
  .put('/api/sessions/:id', editSession)
  .delete('/api/sessions/:id', deleteSession);

router
  .get('/api/categories', getCategories)
  .get('/api/categories/:id', getCategoryById)
  .post('/api/categories', createCategory)
  .put('/api/categories/:id', editCategory)
  .delete('/api/categories/:id', deleteCategory);

export default router;
