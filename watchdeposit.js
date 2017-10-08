// Record all incoming SMS messages from 2882 and record transaction numbers and amounts received in database

app.post('/deposit', (req, res) => {
    var body = _.pick(req.body, ['message', 'secret']);
    var deposit = new GCashDeposit(body);
    // Parse the message (save reference number and amount deposited)
    // Store deposit entry in database
});