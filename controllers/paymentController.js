require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_API_TEST_KEY);

const createPaymentIntent = async (req, res) => {

    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount, currency,
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

module.exports = {createPaymentIntent};