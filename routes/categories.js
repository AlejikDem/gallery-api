import Category from '../models/Category';

export const getCategories = (req, res) => {
  Category.find()
    .then(categories => res.send(categories))
    .catch(err => res.send(err));
};