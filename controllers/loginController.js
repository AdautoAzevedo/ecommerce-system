const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const {userName, password} = req.body;
   
    try {
        const user = await User.findOne({
            where: {
                user_name: userName
            },
        });
        
        if(!user) return res.status(401).json({'message': 'User not found.'});

        const match = await bcrypt.compare(password, user.user_password);
        if (match) {
            const accessToken = jwt.sign(
                {
                    "user_id": user.dataValues.user_id,
                    "user_name": user.dataValues.user_name
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '20m'}
            )
            try {
                const cart = await user.createCart();
                console.log("Cart created:", cart);
            } catch (error) {
                console.log("Erro ao criar carro: ", error);
            }
            
            res.status(200).json({accessToken});

        } else {
            return res.status(401).json({'message': 'Wrong password'});
        }
    } catch (error) {
        res.status(500).json({'message': error.message});
    }
};

module.exports = {handleLogin};