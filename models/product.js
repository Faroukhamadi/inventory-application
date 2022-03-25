const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ProductSchema = new Schema({
  name: { type: String, minlength: 3, maxlength: 20, required: true },
  description: { type: String, minlength: 3, maxlength: 500, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
});

ProductSchema.virtual('url').get(function () {
  return '/product/' + this._id;
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
