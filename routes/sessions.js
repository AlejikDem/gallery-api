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
  const session = new Session(req.body);

  session.save(req.body)
    .then(session => res.send(session))
    .catch(err => res.send(err));
};

export const editSession = (req, res) => {
  Session.findById(req.params.id)
    .then(session => {
      const newSession = Object.assign(session, req.body);

      newSession.save()
        .then(session => res.send(session));
    })
    .catch(err => res.send(err));
};

export const deleteSession = (req, res) => {
  Session.findOneAndRemove({ _id: req.params.id })
    .then(session => res.send(session))
    .catch(err => res.send(err));
};
