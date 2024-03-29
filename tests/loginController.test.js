const {handleLogin} = require('../controllers/loginController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model/user');

jest.mock('../model/user');

describe('handleLogin', () => {
    it('sucessfull login', async () => {
        const req = {
            body: {
                userName: 'existingUser',
                password: 'correctPassword'
            }
        };        
        
        const mockUser = {
            user_id: 1,
            user_name: 'existingUser',
            user_role: 'user',
            user_password: await bcrypt.hash('correctPassword', 10),
            dataValues: {
                user_id: 1,
                user_name: 'existingUser',
                user_role: 'user',
            },
            getCart: jest.fn().mockResolvedValue(null),
            createCart: jest.fn().mockResolvedValue({})
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue('fakeAccessToken');

        await handleLogin(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({accessToken: 'fakeAccessToken'});
    });

    it('should return 401 if user is not found', async () => {
        const req = {
            body: {
                userName: 'nonexistentuser',
                password: 'somepassword'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockResolvedValue(null);
        await handleLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({'message': 'User not found.'});
    });

    it('should return 401 if password is incorrect', async () => {
        const req = {
            body: {
                userName: 'existentuser',
                password: 'wrongpassword'
            }
        };

        const mockUser = {
            user_password: await bcrypt.hash('correctpassword', 10)
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare = jest.fn().mockResolvedValue(false);

        await handleLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({'message': 'Wrong password'});
    });
});