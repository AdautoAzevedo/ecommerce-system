const { getAllProducts, storeNewProduct, getProductById, editProduct, deleteProduct, getProductsByCategory } = require('../controllers/productsController');
const { Product, Category } = require('../model');

//Organize tests into suites using the 'describe' function. Each group should be related to a specific controller method, for organization.
describe('getAllProducts', () => { 

    //Each individual test is defined using the 'it' function. Each test case tests a different behavior or scenario
    it('returns all products', async () => {
        const mockProductList = [{id:1, name: 'Product 1', price: 10.99}, {id: 2, name: 'Product 2', price: 20.99}];

        //Spies a existing function.
        jest.spyOn(Product, 'findAll').mockResolvedValue(mockProductList); //Simulate Sequelize methods using 'jest.spyOn(). 

        const req = {};
        const res = { json: jest.fn() };

        await getAllProducts(req, res);
        expect(res.json).toHaveBeenCalledWith(mockProductList);
    });

    it('handles errors', async () => {
        jest.spyOn(Product, 'findAll').mockRejectedValue(new Error('Database error'));

        const req = {};
        const res = {status: jest.fn().mockReturnThis(), json:jest.fn()};

        await getAllProducts(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'Database error'});
    });
});

describe('storeNewProduct', () => {
    it('stores a new product', async () => {
        const mockCategory = {id: 1, name: 'test Category'};
        const mockProduct = {id:1, name:'Test Product', price: 10.99, category_id: 1};

        jest.spyOn(Category, 'findByPk').mockResolvedValue(mockCategory);
        jest.spyOn(Product, 'create').mockResolvedValue(mockProduct);

        const req = {body: {name: 'Test Product', price: 10.99, categoryId: 1} };
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};

        await storeNewProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ newProduct: mockProduct });
    });

    it('handles category not found', async () => {
        jest.spyOn(Category, 'findByPk').mockResolvedValue(null);

        const req = {body: {name: 'Test Product', price:10.99, categoryId:1}};
        const res = {status: jest.fn().mockReturnThis(),json: jest.fn()};

        await storeNewProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: 'Category not found'});
    });
});