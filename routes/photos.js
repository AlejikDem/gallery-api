import Photo from '../models/Photo';

export const getPhotos = (req, res) => {
  Photo.find()
    .then(photos => res.json(photos))
    .catch(err => res.send(err));
};

export const createPhoto = (req, res) => {
  const photo = new Photo(req.body);

  photo
    .save(req.body)
    .then(data => res.send(data))
    .catch(err => res.send(err));
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
