require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const {mongoose} = require('./db/mongoose');
const {Deposit} = require('./models/deposit');
const {GCashAccount} = require('./models/gcashaccount');
const {GCashSms} = require('./models/gcashsms');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/deposits', (req, res) => {
    let deposit = new Deposit({
        phone: req.body.phone,
        amount: req.body.amount,
        currency: req.body.currency
    });

    deposit.save().then((doc) => {
      res.send(doc);
    }, (err) => {
        res
            .status(400)
            .send(err);
    });
});

app.get('/deposits', (req, res) => {
    Deposit.find().then((deposits) => {
        res.send({deposits});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/deposits/:id', (req, res) => {
    let id = req.params.id;
    // Validate id using isValid
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    // Query the database
    Deposit.findById(id).then((deposit) => {
        if (!deposit) {
            return res.status(404).send();
        }
        res.send({deposit});
    }, (e) => {
        res.status(400).send();
    });
});

app.patch('/deposits/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['referenceNumber']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // Check if there has been an confirmation sent by the user
    Deposit.findByIdAndUpdate(id, {$set: body}, {new: true}).then((deposit) => {
       if (!deposit) {
           return res.status(404).send();
       }
       res.send({deposit})
    }).catch((e) => {
        res.status(400).send();
    });
});

app.get('/getaddress', (req, res) => {
    let body = _.pick(req.body, ['address', 'phone', 'memo_type', 'memo']);
    let phpCode = 'PHP';
    let phpIssuer = 'GAD4Z7VDXJ3ZUGXZ7B6OVQBQCMWNQZROT3VABPAZXLNNIBVMJLEPR7XR';
    server.loadAccount(body.address).then((account) => {
        let trusted = account.balances.some((balance) => {
            return balance.asset_code === phpCode &&
                balance.asset_issuer === phpIssuer;
        });
        if (!trusted) {
            return res.status(400).send();
        }

        let gcashaccount = new GCashAccount({
            phone: body.phone,
            address: body.address
        });

        gcashaccount.save().then(() => {
            // TODO: Could send a QR code address or phone number per depositor
            res.send({depositAddress: '09178838668'});
        }, (err) => {
            res
                .status(400)
                .send(err);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.post('/gcashsms', (req, res) => {
    let body = _.pick(req.body, ['device_id', 'message', 'sender', 'secret']);
    let gcashsms = new GCashSms({
        device_id: body.device_id,
        message: body.message,
        sender: body.sender,
        secret: body.secret
    });
    gcashsms.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res
            .status(400)
            .send(err);
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};