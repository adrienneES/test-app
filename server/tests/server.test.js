const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('../server');
const {Topic} = require('../models/topics');
const {Question} = require('../models/question');
const {topics, populateTopics, questions, populateQuestions} = require('./seed');

beforeEach(populateTopics);
beforeEach(populateQuestions);
describe ('questions', () => {
  describe('PATCH /questions/:topicId/:id', ()=>{
    it('should update if correct', (done)=>{
      const url = `/questions/${questions[0].topic}/${questions[0]._id}`;
      request(app)
        .patch(url)
        .send({question:'some update', answer:'some update'})
        .expect(200)
        .end(()=>{
          Question.findById(questions[0]._id.toHexString())
            .then((question)=>{
              expect(question.question).toBe('some update');
            })
            .catch((err)=>{
              console.log('*******', err);
              done(err);
            })
          done();
        })
    });
    it('should not update if question not found', (done)=>{
      const url = `/questions/${questions[2].topic}/${new ObjectID().toHexString()}`;
      request(app)
        .patch(url)
        .send({question:'some update', answer:'some update'})
        .expect(404)
        .end(done);
    });
    it('should not update if incorrect topic', (done)=>{
      const url = `/questions/${questions[2].topic}/${questions[0]._id}`;
      request(app)
        .patch(url)
        .send({question:'some update', answer:'some update'})
        .expect(404)
        .end(()=>{
          Question.findById(questions[0]._id.toHexString())
            .then(()=>{
              expect(questions[0].question).toBe('what is runtime polymorphism');
            });
          done();
        })
    });
    it('should not update if bad questionid', (done)=>{
      const url = `/questions/${questions[0].topic}/7`;
      request(app)
        .patch(url)
        .send({question:'some update', answer:'some update'})
        .expect(400)
        .expect((res)=>{
          console.log(res.body);
          expect(res.body.message).toBe('bad id');
        })
        .end(()=>{
          Question.findById(questions[0]._id.toHexString())
            .then(()=>{
              expect(questions[0].question).toBe('what is runtime polymorphism');
            })
            done();
        })
    });
    it('should not update if bad topicID', (done)=>{
      const url = `/questions/7/${questions[0]._id}`;
      request(app)
        .patch(url)
        .send({question:'some update', answer:'some update'})
        .expect(400)
        .expect((res)=>{
          console.log(res.body);
          expect(res.body.message).toBe('bad topicid');
        })
        .end(()=>{
          Question.findById(questions[0]._id.toHexString())
            .then(()=>{
              expect(questions[0].question).toBe('what is runtime polymorphism');
            })
            done();
        })
    });
  });
  describe('DELETE /questions/:id', ()=>{
    it('should not delete if bad id', (done) =>{
      request(app)
        .delete('/questions/7')
        .expect(400)
        .end(()=>{
          Question.find().then((questions)=>{
            expect(questions.length).toBe(3);
            done();
          });
        });
    });
    it('should not delete if not found', (done) =>{
      const url = `/questions/${new ObjectID().toHexString()}`;
      console.log(url);
      request(app)
        .delete('url')
        .expect(404)
        .end(()=>{
          Question.find().then((questions)=>{
            expect(questions.length).toBe(3);
            done();
          });
        });
    });
    it('should delete if found', (done) =>{
      const url = `/questions/${questions[0]._id}`;
      console.log(url);
      request(app)
        .delete(url)
        .expect(200)
        .end(()=>{
          Question.find().then((questions)=>{
            expect(questions.length).toBe(2);
            done();
          });
        });
    });
  });
  describe ('GET /questions/topic', () =>{
    it('should return 0 if no questions found', (done)=>{
      const url = `/questions/${new ObjectID().toHexString()}`
      request(app)
        .get(url)
        .expect(200)
        .expect((res)=>{ 
          expect(res.body.count).toBe(0);
        })
        .end(done)
    })
    it('should get only questions for appropriate topic', (done)=>{
        const url =`/questions/${topics[0]._id}`; 
        request(app)
          .get(url)
          .expect(200)
          .expect((data)=>{
            expect(data.body.count).toBe(2);
          })
          .end(done);
    })
  });
  describe('GET /questions/:topic/:id',()=>{
    it('should not return an id for bad topicid', (done)=>{
      const url = `/questions/abc/${questions[0]._id}`;
      request(app)
        .get(url)
        .expect(400)
        .expect((res)=>{
          expect(res.body.message).toBe('bad topicId');
        })
        .end(done);
    })
    it('should not return an id for bad questionid', (done)=>{
      const url = `/questions/${topics[0]._id}/7`;
      request(app)
        .get(url)
        .expect(400)
        .expect((res)=>{
          expect(res.body.message).toBe('bad id');
        })
        .end(done);
    })
    it('should not return a question for diferent topic', (done)=>{
      const url = `/questions/${topics[2]._id}/${questions[0]._id}`;
      console.log(url);
      request(app)
        .get(url)
        .expect(404)
        .expect((res)=>{
          expect(res.body.message).toBe('not found');
        })
        .end(done);
    })
    it('should return a question ', (done)=>{
      const id = questions[0]._id.toHexString();
      const url = `/questions/${topics[0]._id}/${id}`;
      request(app)
        .get(url)
        .expect(200)
        .expect((res)=>{
          expect(res.body.question._id).toBe(id);
        })
        .end(done);
    })
  })
  describe ('POST /question/id', ()=>{
    it('should not create a question if no question', (done)=>{
      const url = `/questions/${topics[0].name}`;
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
      const topic = topics[2]._id;
      const url = `/questions/${topic}`;
      request(app)
        .post(url)
        .send({question:'abc', answer:'def'})
        .expect(200)
        .then((err, res)=>{
          Question.find().then((data)=>{
            expect(data.length).toBe(4);
            done();
          })
        })
        .catch((err)=>{
          console.log('in test got error', err)
          done(err);
        });
    });
  });
});
describe ('topics', () =>{
  describe ('DELETE', ()=>{
    describe ('DELETE /topic',()=>{
      it('should delete a topic if given valid ',(done)=>{
        const id = topics[0]._id;
        request(app)
          .delete(`/topics/${id}`)
          .expect(200)
          .expect((res)=>{
            expect(res.body.topic._id).toBe(id);
          })
          .end(()=>{
            Topic.find({}).then((topics)=>{
              expect(topics.length).toBe(2);
              done();
            });
          })
      })
      it('should not delete a topic if given bad id',(done)=>{
        request(app)
          .delete(`/topics/7`)
          .expect(400)
          .expect((res)=>{
            expect(topics.length).toBe(3);
            expect(res.body.message).toBe(`bad id`)
          })
          .end(done);
      })
      it('should not delete a topic if given wrong id',(done)=>{
        const id = new ObjectID().toHexString();
        request(app)
          .delete(`/topics/${id}`)
          .expect(404)
          .expect((res)=>{
            expect(topics.length).toBe(3);
            expect(res.body.message).toBe(`not found`)
          })
          .end(done);
      })
    })
  });
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
      expect(res.body.count).toBe(3);
      expect(res.body.topics.length).toBe(3);
    })
    .end(done);

  })
})
describe ('Get /topics/id', ()=>{
  it('should get a valid topic', (done)=>{
    request(app)
    .get(`/topics/${topics[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.name).toBe(topics[0].name);
    })
    .end(done);
  });
  it('should return 404 on not found', (done)=>{
    const id = new ObjectID().toHexString();
    request(app)
    .get(`/topics/${id}`)
    .expect(404)
    .end(done);
  });
  it('should return 404 on bad objectid', (done)=>{
    request(app)
    .get(`/topics/7`)
    .expect(400)
    .end(done);
  });
})
describe ('delete /topics', () => {
  it('it should return 404 if not found', (done)=>{
    const id = new ObjectID().toHexString();
    request(app)
      .delete(`/topics/${id}`)
      .expect(404)
      .end(done);
  })
  it('it should return 400 if bad id', (done)=>{
    request(app)
      .delete(`/topics/7`)
      .expect(400)
      .end(done);
  })
  it('it should delete toipc if found', (done)=>{
    request(app)
      .delete(`/topics/${topics[0]._id.toHexString()}`)
      .expect(200)
      .end((err, res)=>{
        Topic.find().then((data)=>{
          expect(data.length).toBe(2);
          done();
        });
      });
  });
});
});
