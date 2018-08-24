const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/test-app'
mongoose.connect(connectionString).then(()=>{
  console.log(`connected to ${connectionString}`);
}).catch((err)=>console.log(`error connecting: ${err}`));

module.exports = {
    mongoose
}