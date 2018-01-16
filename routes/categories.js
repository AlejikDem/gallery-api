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
  try {
    const category = await Category.findById(req.params.id);
    const photos = await Photo.find({ category: category._id }).populate(
      'session',
    );

    res.send({ instance: category, photos });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.send(category);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const editCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body);
    res.send(category);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findOneAndRemove({ _id: req.params.id });
    await Photo.update({ category: req.params.id }, { category: null });

    res.send({ message: 'Category has been deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
};
