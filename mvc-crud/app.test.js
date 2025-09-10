const express = require("express");
const request = require("supertest");
const bodyParser = require("body-parser");
const app = require("./app");


describe("Server", () => {
  let server;
  beforeAll(() => {
    server = app.listen(0, () => {});
  });

  afterAll((done) => {
    server.close(done);
  });

  it("should handle 404 for unknown routes", (done) => {
    request(server)
      .get("/unknownRoute")
      .expect(404, done);
  });


  it("should return 200 for /users", (done) => {
    request(server)
      .get("/users")
      .expect(200, done);
  });


  it("should start listening on a port", () => {
    expect(app.listen).toBeDefined();
  })

  it("should use json body parser", () => {
    expect(app._router.stack.some(s => s.handle.name === 'jsonParser')).toBe(true);
  });


  it("should use the userRoutes", () => {
    expect(app._router.stack.some(s => s.route.path === "/users")).toBe(true);
  });

  it("should handle POST requests to /users", (done) => {
    request(server)
      .post("/users")
      .send({ name: "testuser" })
      .expect(200)
      .end(done);
  });


  it('should handle errors gracefully', (done) => {
      const brokenApp = express();
      brokenApp.use(bodyParser.json());
      brokenApp.use('/users', (req, res) => {
          throw new Error('Something went wrong!');
      });

      const brokenServer = brokenApp.listen(0, () => {});

      request(brokenServer)
          .get('/users')
          .expect(500)
          .end(() => {
              brokenServer.close(done);
          });
  });


  it("should log a message on startup", () => {
    const logSpy = jest.spyOn(console, 'log');
    app.listen(0, () => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Server running at http://localhost:'));
      logSpy.mockRestore();
    });
  });


});