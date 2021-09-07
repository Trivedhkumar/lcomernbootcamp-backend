const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "7wkbkmrsqt7mgxnw",
  publicKey: "2f4rzpbc3zrjjkwp",
  privateKey: "a05d31cc256e36e4e05b91f9a52fcdab",
});

exports.getToken = (req, res) => {
  gateway.clientToken
    .generate({
    
    })
    .then((response) => {
      // pass clientToken to your front-end
      const clientToken = response.clientToken;
      res.send(clientToken);
    })
    .catch((err) => {
      console.log("err");
      res.status(500).send(err);
    });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;
  gateway.transaction
    .sale({
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      deviceData: deviceDataFromTheClient,
      options: {
        submitForSettlement: true,
      },
    })
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
