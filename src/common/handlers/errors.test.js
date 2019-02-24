const assert = require('assert');
const express = require('express');
const request = require('supertest');
const app = express();

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });   
  });
});

describe('GET /api', function() {
  it('responds with json method 1', function(done) {    
    request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          // Falla el test. También podría hacer un throw
          return done(err);
        }
        console.log(res);
        done();
      });
    });

 it('responds with json method 2', function(done) {
      request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});