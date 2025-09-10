const { users, User } = require("../models/userModel");

// CREATE
exports.createUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || name.trim() === "" || !email || email.trim() === "") {
    return res.status(400).json({ message: "Name and email are required" });
  }
  const newUser = new User(name, email);
  users.push(newUser);
  res.status(201).json(newUser);
};

// READ all
exports.getUsers = (req, res) => {
  res.json(users);
};

// READ single
exports.getUserById = (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// UPDATE
exports.updateUser = (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;

  res.json(user);
};

// DELETE
exports.deleteUser = (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "User not found" });

  const deletedUser = users.splice(index, 1);
  res.json(deletedUser[0]);
};
