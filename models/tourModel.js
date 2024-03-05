const mongoose = require('mongoose');
// rules ,configs,default val,types that our model would be follow
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required.'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});
const Tour = mongoose.model('Tour', tourSchema); // actual collection named tours is created
module.exports = Tour;
