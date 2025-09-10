const { users, User } = require('./userModel');

describe('User Model', () => {
  beforeEach(() => {
    users = [];
    idCounter = 1;
  });

  it('should create a new user with correct properties', () => {
    const user = new User('John Doe', 'john.doe@example.com');
    expect(user.id).toBe(1);
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
  });

  it('should assign unique IDs to users', () => {
    const user1 = new User('Jane Doe', 'jane.doe@example.com');
    const user2 = new User('Peter Pan', 'peter.pan@example.com');
    expect(user1.id).toBe(1);
    expect(user2.id).toBe(2);
  });

  it('should handle empty name and email', () => {
    const user = new User('', '');
    expect(user.id).toBe(1);
    expect(user.name).toBe('');
    expect(user.email).toBe('');
  });

  it('should handle null name and email', () => {
    const user = new User(null, null);
    expect(user.id).toBe(1);
    expect(user.name).toBe(null);
    expect(user.email).toBe(null);
  });

  it('should handle name and email with whitespace', () => {
    const user = new User('  ', '   ');
    expect(user.id).toBe(1);
    expect(user.name).toBe('  ');
    expect(user.email).toBe('   ');
  });


  it('should correctly manage the users array', () => {
    const user1 = new User('Alice', 'alice@example.com');
    expect(users.length).toBe(0); //check users array is empty before adding user
    users.push(user1);
    expect(users.length).toBe(1);
    expect(users[0]).toEqual(user1);
  });

  it('should handle large number of users without id collision', () => {
    for (let i = 0; i < 1000; i++) {
      new User(`User ${i}`, `user${i}@example.com`);
    }
    expect(idCounter).toBe(1001);
  });
});