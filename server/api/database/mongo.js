const mongoose = require('mongoose');
const mongoPath = 'mongodb://localhost:27017/test-db';


module.exports = async () => {
  await mongoose.connect(mongoPath);

  return mongoose;
}
