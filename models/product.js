const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    imageUrl: [{
      type: String,
      required: false
    }],
    description: {
      type: String,
      required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    }]

  }
);

module.exports = mongoose.model('Product', productSchema);
