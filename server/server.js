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
app.use((req, res, next) => {
  console.log(req.url);
  next();
});
app.get('/', (req, res)=>{
  res.send('home page for test-app');
})
app.patch('/questions/:topicId/:id', async(req, res)=>{
  try {
    const id = req.params.id;
    const topicId = req.params.topicId;
    if(!ObjectId.isValid(id)) {
      return res.status(400).send({message: 'bad id'});
    }
    if(!ObjectId.isValid(topicId)) {
      return res.status(400).send({message: 'bad topicid'});
    }
    const body=_.pick(req.body, ['question','answer']);
    const question = await Question.findByIdAndUpdate(id,{
      $set:body}, {new:true});
    if(!question) {
      return res.status(404).send();
    }
    return res.send({question});
  } catch (error) {
    console.log('OTHER CATCH', error);
    res.status(400).send({message:error});
  }
});
app.get('/questions/:topicId', async (req, res)=> {
  try {
    const topicId = req.params.topicId;
    if(!ObjectId.isValid(topicId)) {
      return res.status(400).send({message:'bad id'});
    }
    const questions = await Question.find({topic: topicId});
    res.send({count: questions.length, questions});
  } catch (error) {
    console.log('error ', error);
    return res.status(400).send({msg:`error: ${error}`});
   }
});
app.get('/questions/:topicId/:id', async (req, res)=> {
  try {
    const topicId = req.params.topicId;
    const id = req.params.id;
    if(!ObjectId.isValid(id)) {
      return res.status(400).send({message:'bad id'});
    }
    if(!ObjectId.isValid(topicId)) {
      return res.status(400).send({message:'bad topicId'});
    }
    const question = await Question.findOne({_id:id, topic:topicId});
    if(!question) {
      return res.status(404).send({message:'not found'});
    }
    res.send({question});
  } catch (error) {
    return res.status(400).send({msg:`error: ${error}`});
   }
});
app.post('/questions/:id', async (req, res)=> {
  try {
    const id = req.params.id;
    if(!ObjectId.isValid(id)) {
      return res.status(400).send({message:'bad id'});
    }
    const body = _.pick(req.body, ['question', 'answer']);
    body.topic = id;
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
app.delete('/questions/:id', async(req, res)=>{
  try {
    const id = req.params.id;
    console.log('id', id);
    if(!ObjectId.isValid(id)) {
      return res.status(400).send({message:'bad id'});
    }
    const question = await Question.findByIdAndRemove(id);
    if (!question) {
      return res.status(400).send({message:'id not found'});
    }
    return res.send({message:'not quite done'});
    
  } catch (error) {
    res.status(400).send({message:error})
  }
})
app.delete('/topics/:id', async (req, res)=>{
  const id = req.params.id;
  try {
    if(!ObjectId.isValid(id)) {
      return res.status(400).send({message:'bad id'});
    }
    Topic.findByIdAndRemove(id).then((topic)=>{
      if (!topic) {
        return res.status(404).send({message:'not found'});
      }
      res.send({topic});
    });
  } catch (error) {
    return res.status(400).send({msg:`error`});
  }
})
app.get('/topics/:id', async (req, res)=>{
  const id = req.params.id;
  try { 
    if(!ObjectId.isValid(id)) {
      return res.status(400).send({message: 'bad id'});
    }
    if (!id) {
      return res.status(404).send();
    }
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
    res.send({data:'data', result});
  } catch (error) {
    res.status(400).send({error});
  }
})
app.get('/topics', async(req, res)=>{
  try {
    const topics = await Topic.find();
    res.send({count: topics.length,topics});
  } catch (error) {
    res.status(400).send(error)
  }
})
app.listen(PORT, () =>{
  console.log(`started on port ${PORT}`)
})
module.exports = {
  app
}