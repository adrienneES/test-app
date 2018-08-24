const {ObjectID} = require('mongodb');

const {Question} = require('../models/question');
const {Topic} = require('../models/topics');

const populateTopics = (done)=>{
  Topic.remove({}).then(()=>{
    return Topic.insertMany(topics);
  }).then(()=>done())
  .catch((err)=>{console.log('saw error', err);done(err)});
}
const topicIdOne = new ObjectID;
const topicIdTwo = new ObjectID;
const topicIdThree = new ObjectID;
const topics = [ {
  _id: topicIdOne, name:'C#'
}, {
  _id: topicIdTwo, name: 'JavaScript'
}, {
  _id: topicIdThree,   name: 'Node'
}
]

const populateQuestions = (done)=>{
  Question.remove({}).then(()=>{
    return Question.insertMany(questions);
  }).then(()=>done())
  .catch((err)=>{console.log('saw error', err);done(err)});
}

const questions = [{
  topicId: topicIdOne,
  question: 'what is runtime polymorphism',
  answer: 'late binding and overriding of methods'
}, {
  topicId: topicIdOne,
  question: 'abstract vs virtual decorator',
  answer: 'abstract - must override, virtual may override'
}, {
  topicId: topicIdThree,
  question: 'what is node',
  answer: 'javascript runtime'
}  
]

module.exports = {
  topics, populateTopics, questions, populateQuestions
}