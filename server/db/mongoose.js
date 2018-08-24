const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const connectionString = process.env.CONNECTION_STRING || 'mongodb://localhost:27017/test-app'
mongoose.connect(connectionString).then(()=>{
  console.log('connected');
}).catch((err)=>console.log(`error connecting: ${err}`));

module.exports = {
    mongoose
}