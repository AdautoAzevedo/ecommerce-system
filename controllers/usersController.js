const user = require('../model/user');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const usersList = await user.findAll();
        console.log(usersList);
        return res.json(usersList);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const storeNewUser = async (req, res) => {
    const {name, password} = req.body;

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await user.create(
            {
                user_name: name,
                user_password: encryptedPassword
            }
        )
        return res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const getUserById = async (req, res) => {
    const {index} = req.params;

    try {
        const user = await user.findAll({
            where:{user_id: index}
        });
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        };
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const editUser = async (req, res) => {
    const {index} = req.params;
    const {name, password} = req.body;

    try {
        const updatedUser = await user.update(
            {
                user_name: name,
                user_password: password
            }, 
            {where: {user_id: index}}
        );
        return res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const deleteUser = async (req, res) => {
    const {index} = req.params;

    try {
        const account = await user.findByPk(index);

        if (!account) {
            return res.status(404).json({error: 'User not found'});
        }
        await user.destroy({
            where: {user_id: index}
        });
        res.json({message: 'User account deleted sucessfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

module.exports = {getAllUsers, getUserById, editUser, storeNewUser, deleteUser};