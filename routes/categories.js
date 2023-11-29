const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const verifyJWT = require('../middleware/verifyJWT');

router.route('/')
    .get(categoriesController.getAllCategories)
    .post(verifyJWT, categoriesController.storeNewCategory)

router.route('/:index')
    .get(categoriesController.getCategoryById)
    .put(verifyJWT, categoriesController.editCategory)
    .delete(verifyJWT, categoriesController.deleteCategory);

module.exports = router;