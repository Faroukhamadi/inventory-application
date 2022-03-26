const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const CategorySchema = new Schema({
  name: { type: String, minlength: 3, maxlength: 15, required: true },
  description: { type: String, minlength: 10, maxlength: 300, required: true },
});

CategorySchema.virtual('url').get(function () {
  return '/category/' + this._id;
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
