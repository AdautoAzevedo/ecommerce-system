const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const allowCredentials = require('./middleware/allowCredentials');

const PORT = process.env.PORT || 3500;
const db = require("./model/index");

app.use(express.json());
//To use when implement refresh token
//app.use(cookieParser());
//app.use(allowCredentials);
app.use(cors(corsOptions));

app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));
app.use('/login', require('./routes/login'));
app.use('/categories', require('./routes/categories'));
app.use('/cart', require('./routes/cart'));
app.use('/order', require('./routes/orders'));
app.use('/payment', require('./routes/payment'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
