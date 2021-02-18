const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: {
      type: String,
      required: false
    },
    isAdmin: {
      type: Boolean,
      required: true
    },
    cart: {
      type: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            requierd: true
        }
      }],
      required: false
    },
    orders: {
      type:  [{
        type: Schema.Types.ObjectId,
        ref: 'Order',
        requierd: false
      }],
      required: false
    },
    comments: {
      type:  [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
      }],
      required: false
    }
  }
);

module.exports = mongoose.model('User', userSchema);
