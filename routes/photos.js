import Photo from '../models/Photo';
import Category from '../models/Category';
import Session from '../models/Session';
import config from '../config';
import s3 from '../aws';

import {
  prepareFilesForUpload,
  prepareFilesForSave,
  uploadPhotos,
} from '../utils/upload';
import { copyPhotos } from '../utils/edit';
import { makeDeletePhotosParams } from '../utils/delete';

const uploadParams = {
  ACL: 'public-read',
  Bucket: config.bucketName,
};

const deleteParams = {
  Bucket: config.bucketName,
};

export const getPhotos = (req, res) => {
  const { filter, page } = req.query;
  const parsedFilter = JSON.parse(filter);
  const limit = 20;
  const options = {
    skip: (page - 1) * limit,
    limit,
  };

  Photo.find(parsedFilter, null, options)
    .populate('category')
    .populate('session')
    .then(photos => res.json(photos))
    .catch(err => res.send(err));
};

export const addPhotos = (req, res) => {
  const { files, body: { category, session } } = req;
  const parsedCategory = category && JSON.parse(category);
  const parsedSession = session && JSON.parse(session);
  const filesPreparedForUpload = prepareFilesForUpload(files, parsedSession);

  uploadPhotos(filesPreparedForUpload, uploadParams)
    .then(() => {
      const filesPreparedForSave = prepareFilesForSave(
        filesPreparedForUpload,
        parsedCategory,
        parsedSession,
      );

      Photo.insertMany(filesPreparedForSave)
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err));
    })
    .catch(err => res.status(500).send(err));
};

//Нада буде поміняти місцями - спочатку aws - потім база
export const editPhotos = (req, res) => {
  const { ids, field: { type, obj } } = req.body;
  Photo.find({ _id: { $in: ids } })
    .populate('session')
    .then(photos => {
      if (type === 'session') {
        copyPhotos(photos, obj, uploadParams)
          .then(() => {
            const deletePhotoParams = makeDeletePhotosParams(
              photos,
              deleteParams,
            );

            s3.deleteObjects(deletePhotoParams, function(err, data) {
              if (err) res.status(500).send(err);
              photos.forEach(photo => {
                photo[type] = obj ? obj._id : null;
                photo.save();
              });
              res.send({ message: 'Ok' });
            });
          })
          .catch(err => res.status(500).send(err));
      } else {
        photos.forEach(photo => {
          photo[type] = obj ? obj._id : null;
          photo.save();
        });
        res.send({ message: 'Ok' });
      }
    })
    .catch(err => res.status(500).send(err));
};

export const deletePhotos = (req, res) => {
  const { ids } = req.body;

  Photo.find({ _id: { $in: ids } })
    .populate('session')
    .then(photos => {
      const deletePhotoParams = makeDeletePhotosParams(photos, deleteParams);
      s3.deleteObjects(deletePhotoParams, function(err, data) {
        if (err) res.status(500).send(err);
        Photo.remove({ _id: { $in: ids } })
          .then(() => res.send({ message: 'Ok' }))
          .catch(err => res.status(500).send(err));
      });
    })
    .catch(err => res.status(500).send(err));
};
