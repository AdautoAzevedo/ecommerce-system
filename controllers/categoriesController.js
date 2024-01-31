const Category = require('../model/category');
const Product = require('../model/product');

const getAllCategories = async (req, res) => {
    try {
        const categoriesList = await Category.findAll();
        return res.json(categoriesList);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const storeNewCategory = async (req, res) => {
      
    const {name} = req.body;
    try {
        const newCategory = await Category.create(
            {category_name: name}
        );
        return res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const getCategoryById = async (req, res) => {
    const {index} = req.params;

    try {
        const category = await Category.findByPk(index);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({error: error.message});
    } 
};

const editCategory = async (req, res) => {
    const {index} = req.params;
    const {name} = req.body;

    try {
        const updatedCategory = await Category.update(
            {category_name: name},
            {where: {category_id: index}}
        );
        return res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const deleteCategory = async (req, res) => {
    const {index} = req.params;

    try {
        const category = await Category.findByPk(index);
        
        if (!category) {
            return res.status(404).json({ error: 'category not found' });
        }

        await Category.destroy({
            where: {category_id: index}
        });
        res.json({message: 'Category deleted sucessfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

module.exports = {getAllCategories, getCategoryById, editCategory, storeNewCategory, deleteCategory};