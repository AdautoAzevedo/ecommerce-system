const jwt = require('jsonwebtoken');
const verifyJWT = require('../middleware/verifyJWT');
require('dotenv').config();

const mockRequest = () => {
    return {
        headers: {
            authorization: 'Bearer sample_token'
        },
        user: {}
    };
};

const mockResponse = () => {
    const res = {};
    res.sendStatus = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn()
}));

describe('JWT Verification Middleware', () => {
    it('should return 401 if authorization header is missiong', () => {
        const req = mockRequest();
        const res = mockResponse();
        req.headers.authorization = undefined;

        verifyJWT(req, res, mockNext);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
        expect(mockNext).not.toHaveBeenCalled();

    });

    it('should return 403 if token verification fails', () => {
        const req = mockRequest();
        const res = mockResponse();

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'));
        });

        verifyJWT(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({'message': 'Invalid token'});
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should set user properties and call next on successful token verification', () => {
        const req = mockRequest();
        const res = mockResponse();
        const decodedToken = {
            user_id: 'sample_user_id',
            user_name: 'sample_user_name',
            user_role: 'sample_user_role'
        };

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, decodedToken);
        });

        verifyJWT(req, res, mockNext);

        expect(req.user.user_id).toEqual(decodedToken.user_id);
        expect(req.user.user_name).toEqual(decodedToken.user_name);
        expect(req.user.user_role).toEqual(decodedToken.user_role);
        expect(mockNext).toHaveBeenCalled();
    });
});
