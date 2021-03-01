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
    token: {
        type: String,
        required: false
    },
    resetToken: {
        type: String,
        required: false
    },
    resetTokenExp: {
        type: Date,
        required: false
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
      type: {
        productList:{
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
          requierd: true
        },
        total: {
          type: Number,
          requierd: true
        }
      },
      requierd: true
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
