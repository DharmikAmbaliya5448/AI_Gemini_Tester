const { request, response } = require('express');
const userRoutes = require('./userRoutes');
const userController = require('../controllers/userController');

jest.mock('../controllers/userController', () => ({
  createUser: jest.fn(),
  getUsers: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));


describe('userRoutes', () => {
  let req;
  let res;

  beforeEach(() => {
    req = request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    userController.createUser.mockReset();
    userController.getUsers.mockReset();
    userController.getUserById.mockReset();
    userController.updateUser.mockReset();
    userController.deleteUser.mockReset();

  });

  it('should create a user', () => {
    const mockUser = { name: 'Test User' };
    req.body = mockUser;
    userRoutes.post('/', userController.createUser)(req, res);
    expect(userController.createUser).toHaveBeenCalledWith(req, res);
  });

  it('should get all users', () => {
    userRoutes.get('/', userController.getUsers)(req, res);
    expect(userController.getUsers).toHaveBeenCalledWith(req, res);
  });

  it('should get a user by ID', () => {
    const mockId = '1';
    req.params = { id: mockId };
    userRoutes.get(`/:id`, userController.getUserById)(req, res);
    expect(userController.getUserById).toHaveBeenCalledWith(req, res);
  });

  it('should update a user', () => {
    const mockId = '1';
    const mockUser = { name: 'Updated User' };
    req.params = { id: mockId };
    req.body = mockUser;
    userRoutes.put(`/:id`, userController.updateUser)(req, res);
    expect(userController.updateUser).toHaveBeenCalledWith(req, res);
  });

  it('should delete a user', () => {
    const mockId = '1';
    req.params = { id: mockId };
    userRoutes.delete(`/:id`, userController.deleteUser)(req, res);
    expect(userController.deleteUser).toHaveBeenCalledWith(req, res);
  });

  it('should handle errors during user creation', () => {
    const error = new Error('Failed to create user');
    userController.createUser.mockImplementation(() => { throw error; });
    const next = jest.fn();
    userRoutes.post('/', userController.createUser)(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should handle errors during user retrieval', () => {
    const error = new Error('Failed to retrieve users');
    userController.getUsers.mockImplementation(() => { throw error; });
    const next = jest.fn();
    userRoutes.get('/', userController.getUsers)(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should handle errors during user update', () => {
    const error = new Error('Failed to update user');
    userController.updateUser.mockImplementation(() => { throw error; });
    const next = jest.fn();
    req.params = { id: '1' };
    userRoutes.put(`/:id`, userController.updateUser)(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should handle errors during user deletion', () => {
    const error = new Error('Failed to delete user');
    userController.deleteUser.mockImplementation(() => { throw error; });
    const next = jest.fn();
    req.params = { id: '1' };
    userRoutes.delete(`/:id`, userController.deleteUser)(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should handle errors during single user retrieval', () => {
    const error = new Error('Failed to retrieve user');
    userController.getUserById.mockImplementation(() => { throw error; });
    const next = jest.fn();
    req.params = { id: '1' };
    userRoutes.get(`/:id`, userController.getUserById)(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

});