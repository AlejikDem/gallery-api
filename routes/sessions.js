import Session from '../models/Session';

export const getSessions = (req, res) => {
  Session.find()
    .then(sessions => res.send(sessions))
    .catch(err => res.send(err));
};

export const getSessionById = (req, res) => {
  Session.findById(req.params.id)
    .then(session => res.send(session))
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
