// app.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Temporary data store (instead of DB)
let users = [];
let idCounter = 1;

// CREATE (POST /users)
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: idCounter++, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// READ (GET /users)
app.get("/users", (req, res) => {
  res.json(users);
});

// READ single user (GET /users/:id)
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// READ Single user (GET /user/:name)
app.get("/users/:name", (req, res) => {
  const user = users.find(u => u.name === req.params.name);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// UPDATE (PUT /users/:id)
app.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;

  res.json(user);
});

// DELETE (DELETE /users/:id)
app.delete("/users/:id", (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).json({ message: "User not found" });

  const deletedUser = users.splice(userIndex, 1);
  res.json(deletedUser[0]);
});

// Reset function for testing
function resetData() {
  users.length = 0;
  idCounter = 1;
}

// Export app and server for testing
let server;
if (require.main === module) {
  // Only start server if this file is run directly (not when required as module)
  server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = { app, server, users, resetData };
