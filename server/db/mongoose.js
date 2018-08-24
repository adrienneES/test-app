const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const connectionString = process.env.MONGODB_URI;
mongoose.connect(connectionString).then(()=>{
  console.log(`connected to ${connectionString}`);
}).catch((err)=>console.log(`error connecting: ${err}`));

module.exports = {
    mongoose
}