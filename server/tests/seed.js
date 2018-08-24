const {Question} = require('../models/question');
const {Topic} = require('../models/topics');
const {ObjectID} = require('mongodb');
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

module.exports = {
  topics, populateTopics
}