const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('../server');
const {Topic} = require('../models/topics');
const {Question} = require('../models/question');
const {topics, populateTopics, questions, populateQuestions} = require('./seed');

beforeEach(populateTopics);
beforeEach(populateQuestions);
// describe ('topics', () =>{

// describe ('POST /topics', () =>{
// it('should create a new topic', (done)=>{
//   var name = 'adri';
//   request(app)
//     .post('/topics')
//     .send({name})
//     .expect(200)
//     .expect((res) =>{
//       expect(res.body.result.name).toBe(name);
//     })
//     .end((err, res)=>{
//       if(err) {
//         return done(err);
//       }
//       Topic.find({name}).then((topics)=>{
//         expect(topics.length).toBe(1);
//         expect(topics[0].name).toBe(name);
//         done();
//       }).catch((e)=>done(e));
//     })
// })
// it('should not create empty topic', (done)=>{
//   request(app)
//     .post('/topics')
//     .expect(400)
//     .end((err, res)=>{
//       if(err) {
//         return done(err);
//       }
//       Topic.find().then((topics)=>{
//         expect(topics.length).toBe(3);
//         done();
//       }).catch((e)=>done(e));
//     })
// });
// })
// describe ('GET /topics', ()=>{
//   it('should get all topics', (done)=>{
//     request(app)
//     .get('/topics')
//     .expect(200)
//     .expect((res) =>{
//       expect(res.body.length).toBe(3);
//     })
//     .end(done);

//   })
// })
// describe ('Get /topics/id', ()=>{
//   it('should get a valid topic', (done)=>{
//     request(app)
//     .get(`/topics/${topics[0]._id.toHexString()}`)
//     .expect(200)
//     .expect((res)=>{
//       console.log(res.body);
//     })
//     .end(done);
//   });
//   it('should return 404 on not found', (done)=>{
//     const id = new ObjectID().toHexString();
//     request(app)
//     .get(`/topics/${id}`)
//     .expect(404)
//     .end(done);
//   });
//   it('should return 404 on bad objectid', (done)=>{
//     request(app)
//     .get(`/topics/7`)
//     .expect(404)
//     .end(done);
//   });
// })
// describe ('delete /topics', () => {
//   it('it should return 404 if not found', (done)=>{
//     const id = new ObjectID().toHexString();
//     request(app)
//       .delete(`/topics/${id}`)
//       .expect(404)
//       .end(done);
//   })
//   it('it should return 400 if bad id', (done)=>{
//     request(app)
//       .delete(`/topics/7`)
//       .expect(400)
//       .end(done);
//   })
//   it('it should delete toipc if found', (done)=>{
//     request(app)
//       .delete(`/topics/${topics[0]._id.toHexString()}`)
//       .expect(200)
//       .end((err, res)=>{
//         Topic.find().then((data)=>{
//           expect(data.length).toBe(2);
//           done();
//         })
//       })
//   })
// })
// })
describe ('questions', () => {
//   describe ('GET /questions/id', () =>{
//     it('should return 400 if no bad topicid', (done)=>{
//       request(app)
//         .get('/questions/7')
//         .expect(400)
//         .end(done)
//   })
//   it('should return no data if none exists', (done)=>{
//     const id = new ObjectID().toHexString();
//     const url = `/questions/${id}`;
//     request(app)
//       .get(url)
//       .expect(200)
//       .expect((res)=>{
//         expect (res.body.count).toBe(0);
//       })
//       .end(done)
// })
//   it('should get only questions for appropriate topic', (done)=>{
//       const url =`/questions/${topics[0]._id.toHexString()}`; 
//       console.log('url', url)
//       request(app)
//         .get(url)
//         .expect(200)
//         .expect((data)=>{
//           expect(data.body.count).toBe(2);
//         })
//         .end(done);
//     })
//   });
  describe ('POST /question/id', ()=>{
    it('should not create a question if no topic id', (done)=>{
      const url = 'questions/7';
      request(app)
        .post(url)
        .send({question:'abc', answer:'def'})
        .expect(400)
        .expect((res)=>{
          expect(res.body.message).toBe('missing topic id');
        })
        .end((err, res)=>{
          Question.find().then((data)=>{
            expect(data.length).toBe(3);
          })
          done();
        })
    })
    it('should not create a question if no question', (done)=>{
      const url = `/questions/${topics[0]._id}`;
      // console.log(url);
      request(app)
        .post(url)
        .send({answer:'def'})
        .expect(400)
        .expect((res)=>{
          expect(res.body.message).toBe('missing question data');
        })
        .end((err, res)=>{
          Question.find().then((data)=>{
            expect(data.length).toBe(3);
          })
          done();
        })
    })
    it('should create a question if valid data', (done)=>{
      const topicId = topics[2]._id;
      const url = `/questions/${topicId}`;
      request(app)
        .post(url)
        .send({question:'abc', answer:'def'})
        .expect(200)
        .then((err, res)=>{
          Question.find({topicId}).then((data)=>{
            expect(data.length).toBe(2);
            done();
          })
          .catch((err)=>{
            console.log('in test got error', err)
            done(err);
            })
        })
        .catch((err)=>{
          console.log('in test got error', err)
          done(err);
        })
    })
  })
});

