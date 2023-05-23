import config from "config";
import { connect, ConnectOptions } from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI: string = config.get("mongoURI");

    console.log("RRRRRRr");

    connect(mongoURI);
    // ,
    //   {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   //useFindAndModify: false,
    //   //useCreateIndex: true,
    // } as ConnectOptions);



    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;



// const mongoose = require('mongoose');

// // let port = process.env.MONGO_PORT || 27017;
// // let domain = 'localhost';

// mongoose.connect('mongodb://mongo:mongo@' + domain + ':' + port + '/admin', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// });

// const db = mongoose.connection;

// if (!db){
//   console.log("Error connecting db");
// } else {
//   console.log("Db connected successfully");
// }

// db.Promise = global.Promise;

// module.exports = mongoose;