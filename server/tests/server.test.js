const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Deposit} = require('./../models/deposit');
const {GCashAccount} = require('./../models/gcashaccount');
const {GCashSms} = require('./../models/gcashsms');

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
    });
    GCashAccount.remove({});
    GCashSms.remove({}).then(() => done());
});

describe('POST /deposits', () => {
    it('should create a new deposit', (done) => {
       let phone = '09178838668';
       let amount = 2000.00;
       let currency = 'GCASH';

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

describe('PATCH /deposits/:id', () => {
    it('should update the deposit', (done) => {
        let referenceNumber = 251718267;

        request(app)
            .patch(`/deposits/${deposits[0]._id}`)
            .send({
                referenceNumber
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.deposit.referenceNumber).toBe(referenceNumber);
                expect(typeof(res.body.deposit.referenceNumber)).toEqual('number');
            })
            .end(done);
    });
});

describe('GET /getaddress', () => {
    it('should get an address for deposit', (done) => {
        let address = 'GA5GG6LSG5F3PNWQ6FHRF5OWTIQWQJVWERXSOA7UFTLJC2BREGRANDZC';
        let phone = '09178348991';
        let depositAddress = '09178838668';
        request(app)
            .get('/getaddress')
            .send({address, phone})
            .expect(200)
            .expect((res) => {
                expect(res.body.depositAddress).toBe(depositAddress);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                GCashAccount.find({address, phone}).then((gcashaccounts) => {
                    expect(gcashaccounts.length).toBe(1);
                    expect(gcashaccounts[0].address).toBe(address);
                    expect(gcashaccounts[0].phone).toBe(phone);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('POST /gcashsms', () => {
    it('should create a new sms entry', (done) => {
        let device_id = '66301';
        let message = 'You have received P500.00 of GCash from XAVIER LUIS ABLAZA. Your new balance is P500.00 09-20-17 07:49AM Ref. No. 238741559.';
        let sender = '2882';
        let secret = 'thisisasecret';
        request(app)
            .post('/gcashsms')
            .send({device_id, message, sender, secret})
            .expect(200)
            .expect((res) => {
                expect(res.body.device_id).toBe(device_id);
                expect(res.body.message).toBe(message);
                expect(res.body.sender).toBe(sender);
                expect(res.body.secret).toBe(secret);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                GCashSms.find({device_id, message, sender, secret}).then((smsentries) => {
                    expect(smsentries.length).toBe(1);
                    expect(smsentries[0].device_id).toBe(device_id);
                    expect(smsentries[0].message).toBe(message);
                    expect(smsentries[0].sender).toBe(sender);
                    expect(smsentries[0].secret).toBe(secret);
                    done();
                }).catch((e) => done(e));
            });
    });
});