const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('./userController');
const { User } = require('../models/userModel');

describe('User Controller', () => {
  let req, res, next;

  beforeEach(() => {
    users = []; //reset users array before each test
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn(() => ({ json: jest.fn() })),
      json: jest.fn(),
    };
    next = jest.fn();
  });


  describe('createUser', () => {
    it('should create a new user', () => {
      req.body = { name: 'John Doe', email: 'john.doe@example.com' };
      createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'John Doe', email: 'john.doe@example.com' }));
      expect(users.length).toBe(1);
    });

    it('should handle missing name', () => {
      req.body = { email: 'john.doe@example.com' };
      createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: undefined, email: 'john.doe@example.com' }));
      expect(users.length).toBe(1);
    });
    it('should handle missing email', () => {
      req.body = { name: 'John Doe' };
      createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'John Doe', email: undefined }));
      expect(users.length).toBe(1);
    });

    it('should handle missing name and email', () => {
      req.body = {};
      createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: undefined, email: undefined }));
      expect(users.length).toBe(1);
    });
  });

  describe('getUsers', () => {
    it('should return all users', () => {
      users.push(new User('John Doe', 'john.doe@example.com'));
      users.push(new User('Jane Doe', 'jane.doe@example.com'));
      getUsers(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.any(Object), expect.any(Object)]));
    });
    it('should return an empty array if no users exist', () => {
      getUsers(req, res);
      expect(res.json).toHaveBeenCalledWith([]);
    })
  });

  describe('getUserById', () => {
    it('should return a user by ID', () => {
      const user = new User('John Doe', 'john.doe@example.com');
      users.push(user);
      req.params = { id: user.id };
      getUserById(req, res);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should return 404 if user not found', () => {
      req.params = { id: 1 };
      getUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
    it('should handle non-numeric ID', () => {
      req.params = { id: 'abc' };
      getUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('updateUser', () => {
    it('should update a user', () => {
      const user = new User('John Doe', 'john.doe@example.com');
      users.push(user);
      req.params = { id: user.id };
      req.body = { name: 'Jane Doe', email: 'jane.doe@example.com' };
      updateUser(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Jane Doe', email: 'jane.doe@example.com' }));
    });

    it('should partially update a user', () => {
      const user = new User('John Doe', 'john.doe@example.com');
      users.push(user);
      req.params = { id: user.id };
      req.body = { name: 'Jane Doe' };
      updateUser(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Jane Doe', email: 'john.doe@example.com' }));
    });

    it('should return 404 if user not found', () => {
      req.params = { id: 1 };
      req.body = { name: 'Jane Doe' };
      updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
    it('should handle non-numeric ID', () => {
      req.params = { id: 'abc' };
      req.body = { name: 'Jane Doe' };
      updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', () => {
      const user = new User('John Doe', 'john.doe@example.com');
      users.push(user);
      req.params = { id: user.id };
      deleteUser(req, res);
      expect(res.json).toHaveBeenCalledWith(user);
      expect(users.length).toBe(0);
    });

    it('should return 404 if user not found', () => {
      req.params = { id: 1 };
      deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
    it('should handle non-numeric ID', () => {
      req.params = { id: 'abc' };
      deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });
});