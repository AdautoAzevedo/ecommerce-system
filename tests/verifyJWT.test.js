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

    })
})
