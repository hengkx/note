import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/app';

const request = supertest.agent(app.listen());

describe('account', () => {
  describe('with no credentials', () => {
    it('code should return 401', (done) => {
      request
        .get('/api/note')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(401);
          done(err);
        });
    });
  });

  describe('with invalid credentials', () => {
    it('code should return 401', (done) => {
      request
        .get('/api/note')
        .auth('user', 'invalid password')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(401);
          done(err);
        });
    });
  });

  // describe('with valid credentials', () => {
  //   it('should call the next middleware', (done) => {
  //     request
  //       .get('/api/note')
  //       .auth('tj', 'tobi')
  //       .expect(200)
  //       .expect('secret', done);
  //   });
  // });
});
