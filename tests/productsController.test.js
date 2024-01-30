const { getAllProducts, storeNewProduct, getProductById, editProduct, deleteProduct, getProductsByCategory } = require('../controllers/productsController');
const { Product, Category } = require('../model');

//Organize tests into suites using the 'describe' function. Each group should be related to a specific controller method, for organization.
describe('getAllProducts', () => { 

    //Each individual test is defined using the 'it' function. Each test case tests a different behavior or scenario
    it('returns all products', async () => {
        const mockProductList = [{id:1, name: 'Product 1', price: 10.99}, {id: 2, name: 'Product 2', price: 20.99}];

        //Spies a existing function.
        //Simulate Sequelize methods using 'jest.spyOn(). It returns a predefined value (mockProductList) instead of querying the actual db.
        jest.spyOn(Product, 'findAll').mockResolvedValue(mockProductList); 

        //Mock request and response objects to simulate HTTP req and res. 
        //It must contain the necessary properties and methods that the controller function interact with.
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

describe('getProductsById', () => {
    it('returns a product by id', async () => {
        const mockProduct = {id:1, name:'Test Product', price: 10.99, category_id: 1};

        jest.spyOn(Product, 'findByPk').mockResolvedValue(mockProduct);

        const req = {params: {index: 1}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};

        await getProductById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('handles product not found', async () => {
        jest.spyOn(Product, 'findByPk').mockResolvedValue(null);

        const req = {params: {index: 1}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};

        await getProductById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error: "Product not found"});
        
    })

    it('handles errors', async () => {
        jest.spyOn(Product, 'findByPk').mockRejectedValue(new Error('Database error'));

        const req = {params: {index: 1}};
        const res = {status: jest.fn().mockReturnThis(),json: jest.fn()};

        await getProductById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'Database error'});
    });
});

describe('editProduct', () => {
    it('edits an existing product', async () => {
        const mockUpdatedProduct = {id: 1, name: 'Updated Product', price: 15.99};

        jest.spyOn(Product, 'update').mockResolvedValue(mockUpdatedProduct);

        const req = {params: {index: 1}, body: {name: 'Updated Product', price: 15.99}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};

        await editProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUpdatedProduct);
    });

    it('handles errors', async () => {
        jest.spyOn(Product, 'update').mockRejectedValue(new Error('Database error'));

        const req = {params: {index: 1}, body: {name: 'Updated Product', price: 15.99}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};

        await editProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'Database error'});
    });
});

describe('deleteProduct', () => {
    it('deletes an existing product', async () => {
        jest.spyOn(Product, 'findByPk').mockResolvedValue({id: 1});

        const req = {params: {index: 1}};
        const res = {json: jest.fn()};

        await deleteProduct(req, res);
        expect(res.json).toHaveBeenCalledWith({message: 'Product deleted sucessfully'});
    });

    it('handles product not found', async () => {
        jest.spyOn(Product, 'findByPk').mockResolvedValue(null);
        
        const req = {params: {index: 1}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};

        await deleteProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error: 'Product not found'});

    })

    it('handles errors', async () => {
        jest.spyOn(Product, 'findByPk').mockRejectedValue(new Error('Database Error'));

        const req = { params: { index: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await deleteProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });
});

describe('getProductsByCategory', () => {
    it('returns products by category id', async () => {
        const mockCategory = {id: 1, name: 'Test Category', products:[{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]};

        jest.spyOn(Category, 'findByPk').mockResolvedValue(mockCategory);

        const req = {params: {category_id: 1} };
        const res = {json: jest.fn()};

        await getProductsByCategory(req, res);
        expect(res.json).toHaveBeenCalledWith(mockCategory.products);
    });

    it('handles category not found', async () => {
        jest.spyOn(Category, 'findByPk').mockResolvedValue(null);

        const req = {params: {category_id: 1} };
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};

        await getProductsByCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'Category not found'});
    });

    it('handles errors', async () => {
        jest.spyOn(Category, 'findByPk').mockRejectedValue(new Error('Database error'));

        const req = {params: {category_id: 1}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};

        await getProductsByCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'Database error'});
    });
});