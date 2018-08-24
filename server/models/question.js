const {mongoose} = require('../db/mongoose');
const Question = mongoose.model('Question',{
  topicId: {
    type: mongoose.SchemaTypes.ObjectId,
    required:true
  },
  question: {
    type: String, 
    required: true
  },
  answer: {
    type: String, 
    required: true
  },
});

// let question = new Question ({question:'first', answer:'answer'});
// question.save().then((result)=> {
//   console.log('saved', result);
// }).catch((err)=>{
//   console.log('err', err)
// });
module.exports = {
  Question
}