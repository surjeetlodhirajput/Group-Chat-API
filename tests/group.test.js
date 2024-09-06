const request = require('supertest');
const sinon = require('sinon');
const app = require('../app');
const Group = require('../models/Group');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
require('dotenv').config();
describe('Group Controller', () => {
  let saveStub, findByIdStub, findByIdAndDeleteStub, findOneStub;
  const testToken = jwt.sign({ id: '1', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  beforeEach(() => {
    saveStub = sinon.stub(Group.prototype, 'save');
    findByIdStub = sinon.stub(Group, 'findById');
    findByIdAndDeleteStub = sinon.stub(Group, 'findByIdAndDelete');
    findOneStub = sinon.stub(Group, 'findOne');
    saveMessageStub = sinon.stub(Message.prototype, 'save');
    findMessageByIdStub = sinon.stub(Message, 'findById');
    tokenFindStub = sinon.stub(Token,'findOne');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a group successfully', async () => {
    const newGroup = { name: 'Developers Group' };
    saveStub.returns(Promise.resolve(newGroup));
    findOneStub.returns(null);
    tokenFindStub.returns(Promise.resolve(tokenFindStub));
    const res = await request(app)
      .post('/api/groups')
      .send(newGroup).set('Authorization', `Bearer ${testToken}`);


    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Developers Group');
  });

  it('should delete a group successfully', async () => {
    findByIdAndDeleteStub.returns(Promise.resolve());
    tokenFindStub.returns(Promise.resolve(tokenFindStub));
    const res = await request(app)
      .delete('/api/groups/603d4f3d1d1c4b0b2d1b4c1d')
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Group deleted');
  });

  it('should add a member to a group successfully', async () => {
    const group = { _id: '603d4f3d1d1c4b0b2d1b4c1d', members: [] , save: ()=>Promise.resolve()};
    tokenFindStub.returns(Promise.resolve(tokenFindStub));
    findByIdStub.returns(Promise.resolve(group));
    saveStub.returns(Promise.resolve({ ...group, members: ['user1'] }));

    const res = await request(app)
      .post('/api/groups/add-member')
      .send({ groupId: '603d4f3d1d1c4b0b2d1b4c1d', userId: 'user1' })
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.members).toContain('user1');
  });
  it('should send a message to the group', async () => {
    const message = { group: '603d4f3d1d1c4b0b2d1b4c1d', sender: 'user1', content: 'Hello, world!' };
    tokenFindStub.returns(Promise.resolve(tokenFindStub));
    saveMessageStub.returns(Promise.resolve(message));

    const res = await request(app)
      .post('/api/groups/message')
      .send(message)
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('content', 'Hello, world!');
  });

  it('should like a message successfully', async () => {
    const message = { _id: '603d4f3d1d1c4b0b2d1b4c1d', likes: [], save: ()=>Promise.resolve()};
    tokenFindStub.returns(Promise.resolve(tokenFindStub));
    findMessageByIdStub.returns(Promise.resolve(message));
    saveMessageStub.returns(Promise.resolve({ ...message, likes: ['user1'] }));

    const res = await request(app)
      .post('/api/groups/like-message')
      .send({ messageId: '603d4f3d1d1c4b0b2d1b4c1d', userId: 'user1' })
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.likes).toContain('user1');
  });
});
