const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.storeNewUser)

router.route('/:index')
    .get(usersController.getUserById)
    .put(usersController.editUser)
    .delete(usersController.deleteUser);

module.exports = router;