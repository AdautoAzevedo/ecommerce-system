const {getAllCategories, storeNewCategory, getCategoryById, editCategory, deleteCategory} = require('../controllers/categoriesController');
const {Category} = require('../model');

describe('getAllCategories', () => {
    it('returns all categories', async () => {
        const mockCategoriesList = [{id: 1, name: 'Category 1'}, {id:2, name: 'Category 2'}];

        jest.spyOn(Category, 'findAll').mockResolvedValue(mockCategoriesList);
        const req = {};
        const res = { json: jest.fn()};

        await getAllCategories(req, res);
        expect(res.json).toHaveBeenCalledWith(mockCategoriesList);
    });

    it('handle erros', async () => {
        jest.spyOn(Category, 'findAll').mockRejectedValue(new Error('DataBase error'));

        const req = {};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};

        await getAllCategories(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'DataBase error'});
    })
})

describe('getCategoriesById', () => {
    it('return a category by id', async () => {
        const mockCategory = {id: 1, name: 'Test Category'};

        jest.spyOn(Category, 'findByPk').mockResolvedValue(mockCategory);

        const req = {params: {index: 1}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};

        await getCategoryById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCategory);
    });

    it('handles category not found', async () => {
        jest.spyOn(Category, 'findByPk').mockResolvedValue(null);

        const req = {params: {index: 1}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};

        await getCategoryById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error: "Category not found"});
    });
});