const Product = require('./product');
const Category = require('./category');
const Cart = require('./cart');
const CartItem = require('./cartItem');
const User = require('./user');
const Order = require('./order');
const OrderItem = require('./orderItem');

Category.hasMany(Product, {foreignKey: 'category_id'});
Product.belongsTo(Category, {foreignKey: 'category_id'});

User.hasOne(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, {foreignKey: 'user_id'});

Product.hasMany(CartItem, { foreignKey: 'product_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

Order.belongsTo(User, {foreignKey: 'user_id'});
User.hasMany(Order, {foreignKey: 'user_id'});

Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order), {foreignKey: 'order_id'};
OrderItem.belongsTo(Product), {foreignKey: 'product_id'};


module.exports = {Category, Product, Cart, User, CartItem, Order};