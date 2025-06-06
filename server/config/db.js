const mongoose = require('mongoose'); //importing mongoose

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { //mongoose connection
      // these options are now defaults in Mongoose ≥ 6
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB; //exports the function
