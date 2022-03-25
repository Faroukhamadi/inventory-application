const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const productSchema = new Schema({
  name: { type: String, minlength: 3, maxlength: 20, required: true },
  description: { type: String, minlength: 3, maxlength: 500, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
