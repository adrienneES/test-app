//const PORT = process.env.PORT || 7000;
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectId} = require('mongodb');

require('./db/config');
const {mongoose} = require('./db/mongoose');
const {Question} = require('./models/question');
const {User} = require('./models/question');
const {Topic} = require('./models/topics');
const PORT = process.env.PORT;

var app = express()

app.use(bodyParser.json());
app.get('/', (req, res)=>{
  res.send('home page for test-app');
})
app.delete('/topics/:id', async (req, res)=>{
  const id = req.params.id;
  try {
    if(!ObjectId.isValid(id)) {
      return res.status(400).send({msg:'bad id'});
    }
    const topic = await Topic.findByIdAndRemove(id);
    if (!topic) {
      return res.status(404).send({msg:'not found'});
    }
    res.send(topic);
  } catch (error) {
    return res.status(400).send({msg:`error`});
  }

})
app.get('/topics/:id', async (req, res)=>{
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }
  try {
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).send();
    }
    return res.send(topic);
    } catch (error) {
      console.log('err found', error);
      return res.status(404).send();
    }
})
app.post('/topics', async (req, res) => {
  let body = _.pick(req.body, ['name']);
  const topic = new Topic(body);
  try {
    const result = await topic.save();
    console.log('added', result);
    res.send({data:'data', result});
  } catch (error) {
    res.status(400).send({error});
  }
})
app.get('/topics', async(req, res)=>{
  try {
    const topics = await Topic.find();
    res.send(topics);
  } catch (error) {
    res.status(400).send(error)
  }
})
app.get('/questions/:id', async (req, res)=> {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({msg:'badId'});
    }
    const questions = await Question.find({topicId:new ObjectId(id)});
    res.send({count: questions.length, questions});
  } catch (error) {
    console.log('error ', error);
    return res.status(400).send({msg:`error: ${error}`});
   }
})
app.post('/questions/:topicId', async (req, res)=> {
  try {
    const topicId = req.params.topicId;
    if (!ObjectId.isValid(topicId)) {
      console.log('bad topic id');
      return res.status(400).send({message:'missing topic id'});
    }
    const body = _.pick(req.body, ['question', 'answer']);
    body.topicId = new ObjectId(topicId);
    if (!body.question || !body.answer) {
      return res.status(400).send({message:'missing question data'});
    }
    const question = new Question(body);
    const result = await question.save();
    res.send(result)
  } catch (error) {
    console.log(`error`, error);
    res.status(400).send(error);    
  }
});
app.listen(PORT, () =>{
  console.log(`started on port ${PORT}`)
})
module.exports = {
  app
}