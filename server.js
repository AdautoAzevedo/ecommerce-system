const express = require('express');
const app = express();

const PORT = process.env.PORT || 3500;
const db = require("./model/index");
app.use(express.json());

app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));
app.use('/login', require('./routes/login'));
app.use('/categories', require('./routes/categories'));
app.use('/cart', require('./routes/cart'));
app.use('/order', require('./routes/orders'));
app.use('/payment', require('./routes/payment'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
