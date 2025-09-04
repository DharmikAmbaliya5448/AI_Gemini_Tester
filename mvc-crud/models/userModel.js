// Simple in-memory User model
let users = [];
let idCounter = 1;

class User {
  constructor(name, email) {
    this.id = idCounter++;
    this.name = name;
    this.email = email;
  }
}

module.exports = { users, User };
