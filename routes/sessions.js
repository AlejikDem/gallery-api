import Session from '../models/Session';
import Photo from '../models/Photo';

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    const photosPromises = sessions.map(session => {
      return Photo.findOne({ session: session._id });
    });
    const covers = await Promise.all(photosPromises);
    const sessionsWithPhotos = sessions.map((item, index) => {
      return Object.assign({}, item.toJSON(), { photo: covers[index] });
    });
    res.send(sessionsWithPhotos);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    const photos = await Photo.find({ session: session._id })
      .populate('session')
      .populate('category');

    res.send({ instance: session, photos });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const createSession = async (req, res) => {
  try {
    const session = await Session.create(req.body);
    res.send(session);
  } catch (err) {
    res.status(500).send(err);
  }
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
