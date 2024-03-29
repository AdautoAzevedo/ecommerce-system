const Cart = require('../model/cart');
const CartItem = require('../model/cartItem');
const Product = require('../model/product');

const addItem = async (req, res) => {
    const { user_id } = req.user;
    const { productId }= req.body;

    try {
        const cart = await fetchUserCart(user_id);

        if (!cart) return res.status(404).send('Cart not found');

        const cartItems = await cart.getCartItems();
        const existingItem = cartItems.find((item) => item.product_id === productId);

        if (existingItem) {
            existingItem.increment('quantity');
        } else {
            await cart.createCartItem({ product_id: productId, quantity: 1});
        }

        await updateCartPrice(cart);
        
        res.status(200).send('Item added to the cart');
    } catch (error) {
        console.error('Error: ', error.message);
        res.status(500).send('Failed to add item to the cart');
    }
};

const viewCart = async (req, res) => {
    const { user_id } = req.user;

    try {
        const cart = await Cart.findOne({
            where: {user_id: user_id},
            include: [{ model: CartItem, include: [Product] }],
        });

        if (!cart) return res.status(404).send('Cart not found');

        const cartItems = await cart.getCartItems();

        if (!cartItems || cartItems.length === 0) {
            return res.status(200).json([]); 
        }
        
        const cartContents = await getCartContents(cart.cartItems);

        const totalPrice = calculateTotalCartPrice(cart.cartItems);
        
        res.status(200).json({total_price: totalPrice.toFixed(2), items: cartContents});
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).send('Failed to retrieve cart contents');
    }
}


const removeFromCart = async(req, res) => {
    const { user_id } = req.user;
    const { cartItemId } = req.params;
    
    try {
        const deletedItem = await CartItem.destroy({
            where: {cart_item_id: cartItemId},
            include: [{
                model: Cart,
                where: {
                    user_id: user_id
                }
            }]
        });    
        if (deletedItem === 0) return res.status(404).send('Item not found in the cart');
        const cart = await fetchUserCart(user_id);
        await updateCartPrice(cart);

        res.status(204).send('Item removed from the cart');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to remove item from the cart');
    }
}

const updateCartItems = async(req, res) => {
    const { user_id } = req.user;
    const { cartItemId } = req.params;
    const { quantity: newQuantity } = req.body;

    try {
        const result = await CartItem.update(
            {quantity: newQuantity},
            {
                where: {cart_item_id: cartItemId},
                include: [{ model: Cart, where: { user_id: user_id } }]
        });

        if (result[0] === 0) {
            return res.status(404).send('Item not found in the cart');
        }
       
        const cart = await fetchUserCart(user_id);
        await updateCartPrice(cart);

        res.status(200).send('Cart item updated');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to update cart item');
    }
}

//Auxiliary functions
const calculateTotalCartPrice = (cartItems) => {
    let totalCartPrice = 0;
    cartItems.forEach((item) => {
        const itemTotalPrice = parseFloat(item.product.product_price) *item.quantity;
        totalCartPrice += itemTotalPrice;
    })
    return totalCartPrice;
}

const fetchUserCart = async (user_id) => {
    return await Cart.findOne({
        where: {user_id: user_id},
        include: [{ model: CartItem, include: [Product] }],
    });
}

const updateCartPrice = async (cart) => {
    const updatedCart = await Cart.findByPk(cart.cart_id, {
        include: [{model: CartItem, include: [Product] }],
    });

    let totalCartPrice = calculateTotalCartPrice(updatedCart.cartItems);
    await updatedCart.update({ totalPrice: totalCartPrice.toFixed(2) });
};

const getCartContents = (cartItems) => {
    return cartItems.map(item => {
        const { product, quantity } = item;
        const itemTotalPrice = parseFloat(product.product_price) * item.quantity;
        
        return {
            item_id: item.cart_item_id,
            product_name: product.product_name,
            quantity: quantity,
            total_price: itemTotalPrice
        };
    });
};

module.exports = {addItem, viewCart, updateCartItems, removeFromCart};