import Photo from '../models/Photo';

export const getPhotos = (req, res) => {
  Photo.find().exec()
    .then(data => res.send(data))
    .catch(err => conosle.log(err));
};
