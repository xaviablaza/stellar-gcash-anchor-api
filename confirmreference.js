// Watches for reference numbers being sent and cross checks them with the cash-in request and the gcash deposit

app.post('/confirmref', (req, res) => {
    var body = _.pick(req.body, ['message', 'contact', 'secret']);
    // Parse the message (get the reference number)
    // See if reference number matches phone number and reference number in database
    // Issue stellar PHP credit tot the phone number's stellar address
});