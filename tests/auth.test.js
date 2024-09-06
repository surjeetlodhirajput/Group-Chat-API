const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
require('dotenv').config()
describe('Auth Controller', () => {
  let findOneStub;
  let tokenSave;
  let TokenDeleteStub;
  const testToken = jwt.sign({ id: '1', role: 'amdin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  beforeEach(() => {
    TokenDeleteStub = sinon.stub(Token,'findOneAndDelete');
    findOneStub = sinon.stub(User, 'findOne');
    tokenSave = sinon.stub(Token.prototype,'save');
    tokenOneStud = sinon.stub(Token,'findOne');
  });

  afterEach(() => {
    findOneStub?.restore();
    tokenSave.restore();
    TokenDeleteStub.restore();
    tokenOneStud.restore();
  });

  it('should login successfully with correct credentials', async () => {
    const hashedPassword = await bcrypt.hash('testpass', 10);
    const user = {
      username: 'testuser',
      password: hashedPassword,
      comparePassword: ()=>Promise.resolve(true)
    };
    findOneStub.returns(Promise.resolve(user));
    tokenSave.returns(Promise.resolve({}));
    const res = await request(app)
      .post('/api/auth/login/')
      .send({
        username: 'testuser',
        password: 'testpass',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with incorrect credentials', async () => {
    const hashedPassword = await bcrypt.hash('testpass', 10);
    const user = {
      username: 'testuser',
      password: hashedPassword,
      comparePassword: ()=>Promise.resolve(false)
    };
    findOneStub.returns(Promise.resolve(user));
    tokenSave.returns(Promise.resolve({}));
    const res = await request(app)
      .post('/api/auth/login/')
      .send({
        username: 'testuser',
        password: 'wrongpass',
      });

    expect(res.statusCode).toEqual(404);
  });
  it('should logout The User froom the Db', async () => {
    TokenDeleteStub.returns(Promise.resolve(true));
    tokenOneStud.returns(Promise.resolve(testToken));
    //please enter you valid jwt token here to to make this test success jwt is required for proper authentication
    const res = await request(app)
      .post('/api/auth/logout/')
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.statusCode).toEqual(200);
  });
});
