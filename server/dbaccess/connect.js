require('dotenv').config();
const mongoose = require('mongoose');

const db = mongoose.connection;


db.on('error', (err) => {
  console.error('[MongoDB]', err);
});


const connectToMongoDB = async () => {
  try{
    const con = await mongoose.connect(process.env.MONGO_URI)
    console.log(`[MongoDB] Connected to '${con.connection.host}:${con.connection.port}/${con.connection.name}'`);
  } catch (err) {
    console.log('[MongoDB] Failed to connect');
    console.log('[MongoDB]', err);
    process.exit(1);
  }
}


module.exports = connectToMongoDB
