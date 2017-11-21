import Photo from '../models/Photo';

import {
  prepareFilesForUpload,
  prepareFilesForSave,
  uploadPhotos,
} from '../utils/upload';

const uploadParams = {
  ACL: 'public-read',
  Bucket: 'giska-gallery',
};

const copyParams = {
  ACL: 'public-read',
  Bucket: 'giska-gallery',
  CopySource: '/giska-gallery/fun/first.jpg',
  Key: 'second/first.jpg',
};

const deleteParams = {
  Bucket: 'giska-gallery',
  Key: 'fun/first.jpg',
};

export const getPhotos = (req, res) => {
  Photo.find()
    .then(photos => res.json(photos))
    .catch(err => res.send(err));
};

export const addPhotos = (req, res) => {
  const filesPreparedForUpload = prepareFilesForUpload(req.files);

  uploadPhotos(filesPreparedForUpload, uploadParams)
    .then(() => {
      const filesPreparedForSave = prepareFilesForSave(filesPreparedForUpload);

      Photo.insertMany(filesPreparedForSave)
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err));
    })
    .catch(err => res.status(500).send(err));
};

export const editPhoto = (req, res) => {
  Photo.findById(req.params.id)
    .then(data => {
      const newPhoto = Object.assign(data, req.body);

      newPhoto.save().then(data => res.send(data));
    })
    .catch(err => res.send(err));
};

export const deletePhoto = (req, res) => {
  Category.findOneAndRemove({ _id: req.params.id })
    .then(data => res.send(data))
    .catch(err => res.send(err));
};
