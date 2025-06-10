const middleware = require('../../middleware');

describe('Middleware Tests', () => {
	test('should call next() for valid requests', () => {
		const req = {};
		const res = {};
		const next = jest.fn();
		middleware(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	test('should return 401 for unauthorized requests', () => {
		const req = { isAuthenticated: jest.fn().mockReturnValue(false) };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
		const next = jest.fn();
		middleware(req, res, next);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
	});
});