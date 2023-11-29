const Cart = require('../model/cart');
const CartItem = require('../model/cartItem');
const Product = require('../model/product');

const addItem = async (req, res) => {

    const userId = req.user.user_id;
    const productId = req.body.productId;

    try {
        const cart = await Cart.findOne({
            where: {user_id: userId},
            include: [
                {
                    model: CartItem,
                    include: [Product],
                },
            ],
        });

        if (!cart) return res.status(404).send('Cart not found');

        const cartItems = await cart.getCartItems();
        const existingItem = cartItems.find((item) => item.product_id === productId);

        if (existingItem) {
            existingItem.increment('quantity');
        } else {
            await cart.createCartItem({ product_id: productId, quantity: 1});
        }

        const updatedCart = await Cart.findByPk(cart.cart_id, {
            include: [
                {
                    model: CartItem,
                    include: [Product],
                },
            ],
        });


        let totalCartPrice = 0;

        updatedCart.cartItems.forEach((item) => {
            const product = item.product;
            const itemTotalPrice = parseFloat(product.product_price) * item.quantity;
            totalCartPrice += itemTotalPrice;
        });
        console.log("Total price in addItem ", totalCartPrice.toFixed(2));
        
        await updatedCart.update({totalPrice: totalCartPrice.toFixed(2)});            
        
        res.status(200).send('Item added to the cart');
    } catch (error) {
        console.error('Error: ', error.message);
        res.status(500).send('Failed to add item to the cart');
    }
};

const viewCart = async (req, res) => {
    const userId = req.user.user_id;

    try {
        const cart = await Cart.findOne({
            where: {user_id: userId},
            include: [
                {
                    model: CartItem,
                    include: [Product],
                },
            ],
        });

        if (!cart) return res.status(404).send('Cart not found');

        const cartItems = await cart.getCartItems();

        if (!cartItems) {
            return res.status(200).json([]); 
        }

        let totalPrice = 0;
        const cartContents = cart.cartItems.map((item) => {
            const product = item.product;
            const itemTotalPrice = product.product_price * item.quantity;
            totalPrice += itemTotalPrice;

            return{
                product_name: product.product_name,
                quantity: item.quantity,
                total_price: itemTotalPrice,
            };
        });
        
        res.status(200).json({total_price: totalPrice, items: cartContents});
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).send('Failed to retrieve cart contents');
    }
}


const removeFromCart = async(req, res) => {
    const userId = req.user.id;
    const cartItemId = req.params.cartItemId;
    
    try {
        const deletedItem = await CartItem.destroy({
            where: {cart_item_id: cartItemId},
            include: [Cart],
            where: {
                '$Cart.user_id$': userId
            }
        });
        if (deletedItem === 0) return res.status(404).send('Item not found in the cart');

        res.status(200).send('Item removed from the cart');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to remove item from the cart');
    }
}

const updateCartItems = async(req, res) => {
    const userId = req.user.id;
    const cartItemId = req.params.cartItemId;
    const newQuantity = req.body.quantity;

    try {
        const result = await CartItem.update(
            {quantity: newQuantity},
            {
                where: {cart_item_id: cartItemId},
                include:[Cart],
                where: {
                    '$Cart.user_id$': userId
                },
            }
        );

        if (result[0] === 0) {
            return res.status(404).send('Item not found in the cart');
        }
      
        res.status(200).send('Cart item updated');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to update cart item');
    }
}
module.exports = {addItem, viewCart, updateCartItems, removeFromCart};