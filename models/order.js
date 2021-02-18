const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: {
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
    isPaid: {
        type: Boolean,
        requierd: true
    },
    isCanceled: {
        type: Boolean,
        requierd: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
