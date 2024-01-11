const Order = require('../model/order');
const Cart = require('../model/cart');
const CartItem = require('../model/cartItem');
const Product = require('../model/product');

const processOrder = async (req, res) => {
    try {
        const { user_id } = req.user;
        const cart = await Cart.findOne({
            where: {user_id: user_id},
            include: [{ model: CartItem, include: [Product] }],
        });

        if (!cart) {
            throw new Error('Cart not found');
        }

        const orderItems = cart.cartItems.map((item) => ({
            product_id: item.product_id,
            product_name: item.product.product_name,
            quantity: item.quantity,

        }));
        console.log("CartItems: ", cart.cartItems);
        console.log("Order Items: ", orderItems);
        const totalPrice = cart.totalPrice;
        
        const order = await Order.create({
            user_id: user_id,
            totalPrice: totalPrice,
        });

        res.status(201).json({
            message: 'Order placed sucessfully', 
            order:{
                order_id: order.order_id,
                user_id: order.user_id,
                totalPrice: order.totalPrice,
                orderItems: orderItems,
            },
        });
    } catch (error) {
        console.log("Error placing order: ", error);
        res.status(500).json({message: "Failed to place order"});
    }
}

module.exports = {processOrder};