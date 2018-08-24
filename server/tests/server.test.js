const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('../server');
const {Topic} = require('../models/topics');
const {topics, populateTopics} = require('./seed');

beforeEach(populateTopics);
  describe ('POST /topics', () =>{
  it('should create a new topic', (done)=>{
    var name = 'adri';
    request(app)
      .post('/topics')
      .send({name})
      .expect(200)
      .expect((res) =>{
        expect(res.body.result.name).toBe(name);
      })
      .end((err, res)=>{
        if(err) {
          return done(err);
        }
        Topic.find({name}).then((topics)=>{
          expect(topics.length).toBe(1);
          expect(topics[0].name).toBe(name);
          done();
        }).catch((e)=>done(e));
      })
  })
  it('should not create empty topic', (done)=>{
    request(app)
      .post('/topics')
      .expect(400)
      .end((err, res)=>{
        if(err) {
          return done(err);
        }
        Topic.find().then((topics)=>{
          expect(topics.length).toBe(3);
          done();
        }).catch((e)=>done(e));
      })
  });
})
describe ('GET /topics', ()=>{
  it('should get all topics', (done)=>{
    request(app)
    .get('/topics')
    .expect(200)
    .expect((res) =>{
      expect(res.body.length).toBe(3);
    })
    .end(done);

  })
describe ('Get /topics/id', ()=>{
  // it('should get a valid topic', (done)=>{
  //   request(app)
  //   .get(`/topics/${topics[0]._id.toHexString()}`)
  //   .expect(200)
  //   .expect((res)=>{
  //     console.log(res.body);
  //   })
  //   .end(done);
  // });
  // it('should return 404 on not found', (done)=>{
  //   const id = new ObjectID().toHexString();
  //   request(app)
  //   .get(`/topics/${id}`)
  //   .expect(404)
  //   .end(done);
  // });
  it('should return 404 on bad objectid', (done)=>{
    request(app)
    .get(`/topics/7`)
    .expect(404)
    .end(done);
  });
})

})