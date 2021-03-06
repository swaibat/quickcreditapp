import request from 'supertest';
import chai from 'chai';
import app from '../app';

const { expect } = chai;

let adminToken;
let Token;

describe('Admin Route', () => {
  it('should login user successfully and generate admin token', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'kaztech2016@gmail.com', password: 'Kazeem27' })
      .end((err, res) => {
        const { body } = res;
        adminToken = body.token;
        done();
      });
  });
  it('should login user successfully and generate admin token', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'kazmobileapp@gmail.com', password: 'Kazeem27' })
      .end((err, res) => {
        const { body } = res;
        Token = body.token;
        done();
      });
  });
  it('should verified a user successfully', (done) => {
    request(app)
      .patch('/api/v1/users/kazmobileapp@gmail.com/verify')
      .set('token', adminToken)
      .send({ status: 'verified' })
      .then((res) => {
        expect(res.status).to.be.equal(202);
        expect(res.body).to.have.property('data').which.haveOwnProperty('status');
        done();
      })
      .catch(error => done(error));
  });
  it('should not verified a user if not admin token', (done) => {
    request(app)
      .patch('/api/v1/users/kazmobileapp@gmail.com/verify')
      .set('token', Token)
      .send({ status: 'verified' })
      .then((res) => {
        expect(res.status).to.be.equal(403);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Unauthorized!, Admin only route');
        done();
      })
      .catch(error => done(error));
  });
  it('should not verified a user if no admin token', (done) => {
    request(app)
      .patch('/api/v1/users/kazmobileapp@gmail.com/verify')
      .send({ status: 'verified' })
      .then((res) => {
        expect(res.status).to.be.equal(403);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should not verified a user if not present in database', (done) => {
    request(app)
      .patch('/api/v1/users/kazmobileap@gmail.com/verify')
      .set('token', adminToken)
      .send({ status: 'verified' })
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.equal('user not exist');
        done();
      })
      .catch(error => done(error));
  });
  it('should not verified a user successfully with wrong status input', (done) => {
    request(app)
      .patch('/api/v1/users/kazmobileapp@gmail.com/verify')
      .set('token', adminToken)
      .send({ status: 'verify' })
      .then((res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should get all loan application successfully', (done) => {
    request(app)
      .get('/api/v1/loans')
      .set('token', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('rowCount');
        done();
      })
      .catch(error => done(error));
  });
  it('should not get all loan application if its a client token', (done) => {
    request(app)
      .get('/api/v1/loans')
      .set('token', Token)
      .then((res) => {
        expect(res.status).to.be.equal(403);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Unauthorized!, Admin only route');
        done();
      })
      .catch(error => done(error));
  });
  it('should get a specific loan application successfully', (done) => {
    request(app)
      .get('/api/v1/loans/2')
      .set('token', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not get a specific loan application if its a client', (done) => {
    request(app)
      .get('/api/v1/loans/2')
      .set('token', Token)
      .then((res) => {
        expect(res.status).to.be.equal(403);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Unauthorized!, Admin only route');
        done();
      })
      .catch(error => done(error));
  });
  it('should not get a specific loan application successfully', (done) => {
    request(app)
      .get('/api/v1/loans/9')
      .set('token', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Not Found');
        done();
      })
      .catch(error => done(error));
  });
  it('should view current loans (not fully repaid). successfully', (done) => {
    request(app)
      .get('/api/v1/loans?status=approved&repaid=false')
      .set('token', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not view current loans (not fully repaid). if its client', (done) => {
    request(app)
      .get('/api/v1/loans?status=approved&repaid=false')
      .set('token', Token)
      .then((res) => {
        expect(res.status).to.be.equal(403);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Unauthorized!, Admin only route');
        done();
      })
      .catch(error => done(error));
  });
  it('should view all paid loans successfully', (done) => {
    request(app)
      .get('/api/v1/loans?status=approved&repaid=true')
      .set('token', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not view all repaid. if its client', (done) => {
    request(app)
      .get('/api/v1/loans?status=approved&repaid=true')
      .set('token', Token)
      .then((res) => {
        expect(res.status).to.be.equal(403);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Unauthorized!, Admin only route');
        done();
      })
      .catch(error => done(error));
  });
  it('should not view current loans (not fully repaid). successfully', (done) => {
    request(app)
      .get('/api/v1/loans?status=approv&repaid=false')
      .set('token', adminToken)
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.equal('Not Found');
        done();
      })
      .catch(error => done(error));
  });
  it('should approve or reject a loan successfully', (done) => {
    request(app)
      .patch('/api/v1/loans/2')
      .set('token', adminToken)
      .send({ status: 'reject' })
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not approve or reject a loan  if its client', (done) => {
    request(app)
      .patch('/api/v1/loans/1')
      .set('token', Token)
      .send({ status: 'reject' })
      .then((res) => {
        expect(res.status).to.be.equal(403);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Unauthorized!, Admin only route');
        done();
      })
      .catch(error => done(error));
  });
  it('should not approve or reject a loan  if not present', (done) => {
    request(app)
      .patch('/api/v1/loans/10')
      .set('token', adminToken)
      .send({ status: 'reject' })
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should not approve or reject a loan with wrong input', (done) => {
    request(app)
      .patch('/api/v1/loans/2')
      .set('token', adminToken)
      .send({ status: 'rejected' })
      .then((res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should successfully post loan repayment for a client', (done) => {
    request(app)
      .post('/api/v1/loans/1/repayment')
      .set('token', adminToken)
      .send({ paidAmount: 3000 })
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not post loan repayment for a client', (done) => {
    request(app)
      .post('/api/v1/loans/4/repayment')
      .set('token', adminToken)
      .send({ })
      .then((res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should not post loan repayment for a client', (done) => {
    request(app)
      .post('/api/v1/loans/2/repayment')
      .set('token', adminToken)
      .send({ paidAmount: 500000 })
      .then((res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.equal('you can not pay more than your debt!');
        done();
      });
  });
  it('should not post loan repayment for a client', (done) => {
    request(app)
      .post('/api/v1/loans/4/repayment')
      .set('token', adminToken)
      .send({ paidAmount: 3000 })
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });
});
