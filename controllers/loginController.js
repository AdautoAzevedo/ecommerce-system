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
                    "user_name": user.dataValues.user_name,
                    "user_role": user.dataValues.user_role
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '20m'}
            )

            try {
                let cart = await user.getCart();
                if (!cart) {
                    console.log("Cart created");
                    cart = await user.createCart();                    
                }
                
            } catch (error) {
                console.log("Error creating cart: ", error);
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