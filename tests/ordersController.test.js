const { processOrder } = require('../controllers/ordersController');
const Order = require('../model/order');
const Cart = require('../model/cart');
const CatItem = require('../model/cartItem');
const Product = require('../model/product');
const CartItem = require('../model/cartItem');

jest.mock('../model/order');
jest.mock('../model/cart');
jest.mock('../model/cartItem');
jest.mock('../model/product');

describe('processOrder controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create order successfully', async () => {
        const req = {
            user: {user_id: 1}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockCartItem = {
            product_id: 1,
            product: {product_name: 'Some Product'},
            quantity: 2
        };

        const mockCart = {
            cartItems: [mockCartItem],
            totalPrice: 20
        };

        Cart.findOne.mockResolvedValue(mockCart);
        Order.create.mockResolvedValue({order_id: 1, user_id: 1, totalPrice: 20});

        await processOrder(req, res);

        expect(Cart.findOne).toHaveBeenCalledWith({
            where: {user_id: 1},
            include: [{model: CartItem, include:[Product]}],
        });

        expect(Order.create).toHaveBeenCalledWith({
            user_id: 1,
            totalPrice: 20
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Order placed sucessfully',
            order: {
                order_id: 1,
                user_id: 1,
                total_price: 20,
                order_items: [{
                    product_id: 1,
                    product_name: 'Some Product',
                    quantity: 2
                }],
            }
        });
    });

    it('should handle error if cart is not found', async () => {
        const req = {
            user: {user_id: 1}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        Cart.findOne.mockResolvedValue(null);

        await processOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Failed to place order"});
    });

    it('should handle errors during order creation', async () => {
        const req = {
            user: {user_id: 1}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockCartItem = {
            product_id: 'someProductId',
            product: { product_name: 'Some Product' },
            quantity: 2
        };
        const mockCart = {
            cartItems: [mockCartItem],
            totalPrice: 20
        };

        Cart.findOne.mockResolvedValue(mockCart);
        Order.create.mockRejectedValue(null);

        await processOrder(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to place order' });
    });
})
