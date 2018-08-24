const PORT = process.env.PORT || 7000;
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectId} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Question} = require('./models/question');
const {User} = require('./models/question');
const {Topic} = require('./models/topics');

var app = express()

app.use(bodyParser.json());
app.get('/', (req, res)=>{
  res.send('home page for test-app');
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
app.get('/questions/', async (req, res)=> {

})
app.post('/questions', async (req, res)=> {
  const question = new Question(_.pick(req.body, ['topicId, question', 'answer']));
  try {
    const result = await question.save();
    res.send(result)
  } catch (error) {
    res.send(error);    
  }
})
app.listen(PORT, () =>{
  console.log(`started on port ${PORT}`)
})
module.exports = {
  app
}