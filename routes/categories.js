import Category from '../models/Category';
import Photo from '../models/Photo';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  const photos = await Photo.find({ category: category._id }).populate(
    'session',
  );

  res.send({ instance: category, photos });
};

export const createCategory = (req, res) => {
  Category.create(req.body)
    .then(data => res.send(data))
    .catch(err => res.send(err));
};

export const editCategory = (req, res) => {
  Category.findByIdAndUpdate(req.params.id, req.body)
    .then(data => res.send(data))
    .catch(err => res.send(err));
};

export const deleteCategory = (req, res) => {
  Category.findOneAndRemove({ _id: req.params.id })
    .then(data => res.send({ message: 'Category has been deleted' }))
    .catch(err => res.send(err));
};
