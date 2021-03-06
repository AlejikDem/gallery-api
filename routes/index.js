import { Router } from 'express';
import multer from 'multer';

import { getPhotos, addPhotos, editPhotos, deletePhotos } from './photos';
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
const photoMulter = multer().array('photo');

router
  .get('/api/photos', getPhotos)
  .post('/api/photos', photoMulter, addPhotos)
  .put('/api/photos', editPhotos)
  .delete('/api/photos', deletePhotos);

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
