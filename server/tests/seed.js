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
  _id: topicIdOne, name:'CSharp'
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
const questionId1 = new ObjectID();
const questionId2 = new ObjectID();
const questionId3 = new ObjectID();
const questions = [{
  _id: questionId1,
  topic: topics[0]._id,
  question: 'what is runtime polymorphism',
  answer: 'late binding and overriding of methods'
}, {
  _id: questionId2,
  topic: topics[0]._id,
  question: 'abstract vs virtual decorator',
  answer: 'abstract - must override, virtual may override'
}, {
  _id: questionId3,
  topic: topics[1]._id,
  question: 'what is node',
  answer: 'javascript runtime'
}  
]

module.exports = {
  topics, populateTopics, questions, populateQuestions
}