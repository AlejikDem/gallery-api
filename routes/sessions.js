import Session from '../models/Session';
import Photo from '../models/Photo';

export const getSessions = async (req, res) => {
  Session.find()
    .then(sessions => {
      const photosPromises = sessions.map(session => {
        return Photo.findOne({ session: session._id });
      });
      Promise.all(photosPromises)
        .then(photos => {
          const sessionsWithPhotos = sessions.map((item, index) => {
            return Object.assign({}, item.toJSON(), { photo: photos[index] });
          });
          res.send(sessionsWithPhotos);
        })
        .catch(err => console.log(err));
    })
    .catch(err => res.send(err));
};

export const getSessionById = (req, res) => {
  Session.findById(req.params.id)
    .then(session => {
      Photo.find({ session: session._id })
        .populate('session')
        .populate('category')
        .then(photos => {
          res.send({
            instance: session,
            photos,
          });
        })
        .catch(err => res.send(err));
    })
    .catch(err => res.send(err));
};

export const createSession = (req, res) => {
  Session.create(req.body)
    .then(session => res.send(session))
    .catch(err => res.send(err));
};

export const editSession = (req, res) => {
  Session.findByIdAndUpdate(req.params.id, req.body)
    .then(session => res.send(session))
    .catch(err => res.send(err));
};

export const deleteSession = (req, res) => {
  Session.findOneAndRemove({ _id: req.params.id })
    .then(session => res.send({ message: 'Session has been deleted' }))
    .catch(err => res.send(err));
};
