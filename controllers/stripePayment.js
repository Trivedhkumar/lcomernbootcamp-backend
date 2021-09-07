const stripe = require("stripe")(
  "sk_test_51JEUjdSCf6j2metuGam36xzvqZqw1gOuOh4oZWONEPQOo7cxa3Os7Pywo7FOCoiDluaVy02aTnIwekrSAvdR1ONP00NfbmyZhj"
);
const uuid = require("uuid/v4");
exports.makePayment = (req, res) => {
  const { products, token } = req.body;

  let amount = 0;
  products.map((product) => {
    amount += product.price;
  });
  const idempotencyKey = uuid();
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customers) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customers.id,
            description: "a test account",
          },
          { idempotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
