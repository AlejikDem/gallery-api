import Session from '../models/Session';
import Photo from '../models/Photo';

export const getSessions = (req, res) => {
  Session.find()
    .then(sessions => res.send(sessions))
    .catch(err => res.send(err));
};

export const getSessionById = (req, res) => {
  Session.findById(req.params.id)
    .then(session => {
      Photo.find({ session: session._id })
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
