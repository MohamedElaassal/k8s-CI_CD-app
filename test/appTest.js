const chai = require('chai');
const request = require('supertest');
const app = require('../app'); // Adjust this path to point to your main app file

describe('App Tests', () => {
    it('should return Hello, Kubernetes CI/CD!', function(done) {
        this.timeout(5000); // Set 5 second timeout
        
        request(app)
            .get('/')
            .expect(200)
            .expect('Hello, Kubernetes CI/CD!')
            .end(done);
    });
});
