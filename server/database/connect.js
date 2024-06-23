const mongoose = require('mongoose');


const connectToMongoDB = async () => {
  try{
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB] Connected to ${con.connection.host}:${con.connection.port}`);
  } catch (err) {
    console.log('[MongoDB] Failed to connect');
    console.log(err);
    process.exit();
  }
}


module.exports = connectToMongoDB
