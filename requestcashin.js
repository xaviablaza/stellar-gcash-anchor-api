// NOTE: KEEPING THIS IS GOOD BECAUSE WE CAN JUST CHARGE THE NUMBER AND HAVE THE USER REPLY WITH AN MPIN
// Receives a phone number and amount of GCash as parameter

// Check the database if phone number exists
// if phone number exists
// then
// Add amount of gcash and number with status pending
// echo that request for cash in has been confirmed and waiting gcash deposit
// else
// Echo that request for cash-in has been denied because phone number is not in database
app.post('/cashin', (req, res) => {
    var body = _.pick(req.body, ['phone', 'amount']);
    var cashin = new CashIn(body);
    CashIn.findPhoneNumber(body.phone).then(() => {
        // TODO: Save cashin entry
        res.send("CashIn request successful.");
    }).catch((e) => {
        res.status(400).send("CashIn request denied");
    });
});


// Outputs whether cash-in request has accepted and ready to receive GCash Deposit
// Cash-in request is accepted if the number is in the database (if number is in database then it has trusted the issuer)
// Cash-in request is not accepted if the number is not in the database