const request = require('supertest');
const sinon = require('sinon');
const app = require('../app');
const User = require('../models/User');
const Token = require("../models/Token");
const jwt = require('jsonwebtoken');
require('dotenv').config()
//Note:: Remember to replace jwt to you valid jwt to make this test cases run succesfully
describe('User Controller', () => {
  let saveStub, findByIdAndUpdateStub, tokenOneStud;
  const testToken = jwt.sign({ id: '1', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  beforeEach(() => {
    saveStub = sinon.stub(User.prototype, 'save');
    findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate');
    tokenOneStud = sinon.stub(Token,'findOne');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a new user successfully', async () => {
    const newUser = { username: 'johnDoe', password: 'password123', role: 'user' };
    saveStub.returns(Promise.resolve(newUser));
    tokenOneStud.returns(Promise.resolve(testToken));
    const res = await request(app)
      .post('/api/users/')
      .send(newUser)
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', 'johnDoe');
    expect(res.body).toHaveProperty('role', 'user');
  });
  it('should update an existing user successfully', async () => {
    const updatedUser = { username: 'janeDoe', role: 'admin' };
    findByIdAndUpdateStub.returns(Promise.resolve(updatedUser));
    tokenOneStud.returns(Promise.resolve(testToken));
    const res = await request(app)
      .put('/api/users/603d4f3d1d1c4b0b2d1b4c1d')
      .send(updatedUser)
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'janeDoe');
    expect(res.body).toHaveProperty('role', 'admin');
  });
});
