const Order = require('../model/order');
const Cart = require('../model/cart');
const CartItem = require('../model/cartItem');

const processOrder = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const cart = await Cart.findOne({where: {user_id:userId}, include: [CartItem]});

        if (!cart) {
            throw new Error('Cart not found');
        }
       

        const cartItems = cart.cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
        }));
        
        const totalPrice = cart.totalPrice;

        console.log('User_id: ', userId);
        console.log(totalPrice);
        const order = await Order.create({
            user_id: userId,
            totalPrice: totalPrice,
        });
        console.log(order);

        await order.addProducts(cartItems);
        await cart.setCartItems([]);

        res.status(201).json({message: 'Order placed sucessfully', order});
    } catch (error) {
        console.log("Error placing order: ", error);
        res.status(500).json({message: "Failed to place order"});
    }
}

module.exports = {processOrder};