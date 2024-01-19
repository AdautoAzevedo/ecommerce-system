const category = require('../model/category');
const Product = require('../model/product');

const getAllCategories = async (req, res) => {
    try {
        const categoriesList = await category.findAll();
        return res.json(categoriesList);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const storeNewCategory = async (req, res) => {
      
    const {name} = req.body;
    try {
        const newCategory = await category.create(
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
        const category = await category.findAll({
            where: {category_id: index}
        });

        if (!category) {
            return res.status(404).json({ error: 'category not found' });
        }
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({error: error.message});
    } 
};

const editCategory = async (req, res) => {
    const {index} = req.params;
    const {name} = req.body;

    try {
        const updatedCategory = await category.update(
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
        const category = await category.findByPk(index);
        
        if (!category) {
            return res.status(404).json({ error: 'category not found' });
        }

        await category.destroy({
            where: {category_id: index}
        });
        res.json({message: 'Category deleted sucessfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

module.exports = {getAllCategories, getCategoryById, editCategory, storeNewCategory, deleteCategory};