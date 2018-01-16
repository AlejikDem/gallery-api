import Photo from '../models/Photo';
import { uploadParams, deleteParams } from '../config';
import s3 from '../aws';

import {
  prepareFilesForUpload,
  prepareFilesForSave,
  uploadPhotos,
} from '../utils/upload';
import { copyPhotos } from '../utils/edit';
import { makeDeletePhotosParams } from '../utils/delete';

export const getPhotos = async (req, res) => {
  try {
    const { filter, page } = req.query;
    const parsedFilter = JSON.parse(filter);
    const limit = 20;
    const options = {
      skip: (page - 1) * limit,
      limit,
    };

    const photos = await Photo.find(parsedFilter, null, options)
      .populate('category')
      .populate('session');

    res.send(photos);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const addPhotos = async (req, res) => {
  try {
    const { files, body: { category, session } } = req;
    const parsedCategory = category && JSON.parse(category);
    const parsedSession = session && JSON.parse(session);
    const filesPreparedForUpload = prepareFilesForUpload(files, parsedSession);

    await uploadPhotos(filesPreparedForUpload, uploadParams);
    const filesPreparedForSave = prepareFilesForSave(
      filesPreparedForUpload,
      parsedCategory,
      parsedSession,
    );

    const photos = await Photo.insertMany(filesPreparedForSave);
    res.send(photos);
  } catch (err) {
    res.status(500).send(err);
  }
};

//Нада буде поміняти місцями - спочатку aws - потім база
export const editPhotos = (req, res) => {
  const { ids, field: { type, obj } } = req.body;
  Photo.find({ _id: { $in: ids } })
    .populate('session')
    .then(photos => {
      if (type === 'session') {
        copyPhotos(photos, obj.name, uploadParams)
          .then(() => {
            const deletePhotoParams = makeDeletePhotosParams(
              photos,
              deleteParams,
            );

            s3.deleteObjects(deletePhotoParams, function(err) {
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
      s3.deleteObjects(deletePhotoParams, function(err) {
        if (err) res.status(500).send(err);
        Photo.remove({ _id: { $in: ids } })
          .then(() => res.send({ message: 'Ok' }))
          .catch(err => res.status(500).send(err));
      });
    })
    .catch(err => res.status(500).send(err));
};
