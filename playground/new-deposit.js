// Make a new document to insert
var newDeposit = new Deposit({
    phone: '09178838668',
    amount: '1000',
    currency: 'GCASH',
});

// Save that document into MongoDB
newDeposit.save().then((doc) => {
    console.log('Saved deposit', doc);
}, (err) => {
    console.log('Unable to save deposit');
});