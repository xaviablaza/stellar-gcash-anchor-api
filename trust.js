let server = new StellarSDK.Server('https://horizon-testnet.stellar.org');
server.loadAccount(targetAccount)
    .then((account) => {
    var transaction = new StellarSDK.TransactionBuilder(account)
        .addOperation(StellarSDK.Operation.changeTrust({
            asset: new StellarSDK.Asset('PHP', 'GAGYUGOQSZMGQUZO35CJ4JUP2CJ65YWSWTDNYPCXOUDIF4JBD3E4EDEO'),
            limit: 100000,
        })
        .build());

transaction.sign(StellarSDK.Keypair.fromSecret(targetAccountSecret));
return server.submitTransaction(transaction);
});