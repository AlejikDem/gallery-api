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

export const editPhotos = async (req, res) => {
  try {
    const { ids, field: { type, obj } } = req.body;
    const photos = await Photo.find({ _id: { $in: ids } }).populate('session');
    if (type === 'session') {
      await copyPhotos(photos, obj.name, uploadParams);

      const deletePhotoParams = makeDeletePhotosParams(photos, deleteParams);
      await s3.deleteObjects(deletePhotoParams).promise();

      photos.forEach(photo => {
        photo[type] = obj ? obj._id : null;
        photo.save();
      });
    }

    photos.forEach(photo => {
      photo[type] = obj ? obj._id : null;
      photo.save();
    });

    res.send({ message: 'Photos have been edited' });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deletePhotos = async (req, res) => {
  try {
    const { ids } = req.body;
    const photos = await Photo.find({ _id: { $in: ids } }).populate('session');

    const deletePhotoParams = makeDeletePhotosParams(photos, deleteParams);
    await s3.deleteObjects(deletePhotoParams).promise();
    await Photo.remove({ _id: { $in: ids } });

    res.send({ message: 'Ok' });
  } catch (err) {
    res.status(500).send(err);
  }
};
