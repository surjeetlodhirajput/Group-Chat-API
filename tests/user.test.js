const request = require('supertest');
const sinon = require('sinon');
const app = require('../app');
const User = require('../models/User');
const Token = require("../models/Token");
require('dotenv').config()
//Note:: Remember to replace jwt to you valid jwt to make this test cases run succesfully
describe('User Controller', () => {
  let saveStub, findByIdAndUpdateStub;

  beforeEach(() => {
    saveStub = sinon.stub(User.prototype, 'save');
    findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a new user successfully', async () => {
    const newUser = { username: 'johnDoe', password: 'password123', role: 'user' };
    saveStub.returns(Promise.resolve(newUser));

    const res = await request(app)
      .post('/api/users/')
      .send(newUser)
      .set('Authorization', `Bearer ${process.env.TEST_JWT}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', 'johnDoe');
    expect(res.body).toHaveProperty('role', 'user');
  });
  it('should update an existing user successfully', async () => {
    const updatedUser = { username: 'janeDoe', role: 'admin' };
    findByIdAndUpdateStub.returns(Promise.resolve(updatedUser));

    const res = await request(app)
      .put('/api/users/603d4f3d1d1c4b0b2d1b4c1d')
      .send(updatedUser)
      .set('Authorization', `Bearer ${process.env.TEST_JWT}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'janeDoe');
    expect(res.body).toHaveProperty('role', 'admin');
  });
});
