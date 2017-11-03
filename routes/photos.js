import Photo from '../models/Photo';

export const getPhotos = (req, res) => {
  Photo.find()
    .then(photos => res.json(photos))
    .catch(err => res.send(err));
};
