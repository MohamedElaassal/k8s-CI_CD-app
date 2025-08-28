const chai = require('chai');
const request = require('supertest');
const app = require('../app'); // Adjust this path to point to your main app file
const expect = chai.expect;

describe('App Tests', () => {
    it('should return Hello, Kubernetes CI/CD!', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .expect('Hello, Kubernetes CI/CD!')
            .end(done);
    });
});
