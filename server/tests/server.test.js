const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Deposit} = require('./../models/deposit');

const deposits = [{
    _id: new ObjectID(),
    phone: '09178838668',
    amount: 8000.00,
    currency: 'GCASH'
}, {
    _id: new ObjectID(),
    phone: '09183365776',
    amount: 5000.00,
    currency: 'GCASH'
}];

beforeEach((done) => {
    Deposit.remove({}).then(() => {
        return Deposit.insertMany(deposits);
    }).then(() => done());
});

describe('POST /deposits', () => {
    it('should create a new deposit', (done) => {
       var phone = '09178838668';
       var amount = 2000.00;
       var currency = 'GCASH';

       request(app)
           .post('/deposits')
           .send({phone, amount, currency})
           .expect(200)
           .expect((res) => {
               expect(res.body.phone).toBe(phone);
               expect(res.body.amount).toBe(amount);
               expect(res.body.currency).toBe(currency);
           })
           .end((err, res) => {
               if (err) {
                   return done(err);
               }

               Deposit.find({phone, amount, currency}).then((deposits) => {
                   expect(deposits.length).toBe(1);
                   expect(deposits[0].phone).toBe(phone);
                   expect(deposits[0].amount).toBe(amount);
                   expect(deposits[0].currency).toBe(currency);
                   done();
           }).catch((e) => done(e));
       });
    });

    it('should not create deposit with invalid body data', (done) => {
       request(app)
           .post('/deposits')
           .send({})
           .expect(400)
           .end((err, res) => {
               if (err) {
                   return done(err);
               }
               Deposit.find().then((deposits) => {
                   expect(deposits.length).toBe(2);
                   done();
               }).catch((e) => done(e));
           });
    });
});

describe('GET /deposits', () => {
    it('should get all deposits', (done) => {
        request(app)
            .get('/deposits')
            .expect(200)
            .expect((res) => {
                expect(res.body.deposits.length).toBe(2);
            })
            .end(done);
    })
});

describe('GET /deposits/:id', () => {
   it('should return a deposit doc', (done) => {
       request(app)
           .get(`/deposits/${deposits[0]._id.toHexString()}`)
           .expect(200)
           .expect((res) => {
                expect(res.body.deposit.phone).toBe(deposits[0].phone);
                expect(res.body.deposit.amount).toBe(deposits[0].amount);
                expect(res.body.deposit.currency).toBe(deposits[0].currency);
           })
           .end(done);
   });

   it('should return 404 if deposit not found', (done) => {
      // make sure you get a 404 back
      request(app)
          .get(`/deposits/${new ObjectID().toHexString()}`)
          .expect(404)
          .end(done);
   });

   it('should return 404 for non-object ids', (done) => {
      // /todos/123
       request(app)
           .get('/deposits/123')
           .expect(404)
           .end(done);
   });
});