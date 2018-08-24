const {mongoose} = require('../db/mongoose');
const {ObjectID} = require('mongoose');
const Topic = mongoose.model('Topic',{
  name: {
    type: String, 
    required: true
  }
});

// let question = new Question ({question:'first', answer:'answer'});
// question.save().then((result)=> {
//   console.log('saved', result);
// }).catch((err)=>{
//   console.log('err', err)
// });
module.exports = {
  Topic
}