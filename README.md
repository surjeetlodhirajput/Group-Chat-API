
# Group Chat APIS

A simple Node.js application providing web services for group chat and data management. This application includes endpoints for user management, authentication, group management, and group messaging.

## Table of Contents
```markdown
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Admin APIs](#admin-apis)
  - [Authentication APIs](#authentication-apis)
  - [Group Management APIs](#group-management-apis)
  - [Group Messaging APIs](#group-messaging-apis)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
```
## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v14 or higher)
- [MongoDB](https://www.mongodb.com) (local or cloud instance)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/surjeetlodhirajput/Group-Chat-API.git
   cd group-chat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables. Create a `.env` file in the root directory with the following content:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/groupchatdb
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:

   ```bash
   npm start
   ```

## Usage

The application provides the following API endpoints:

### Admin APIs

**Manage Users (Admin only)**

- **Create User**

  `POST /api/users`

  **Request Body:**

  ```json
  {
    "username": "newuser",
    "password": "password123",
    "role": "user" // or "admin"
  }
  ```

  **Response:**

  ```json
  {
    "_id": "user_id",
    "username": "newuser",
    "role": "user"
  }
  ```

- **Edit User**

  `PUT /api/users/:id`

  **Request Body:**

  ```json
  {
    "username": "updateduser",
    "role": "admin" // or "user"
  }
  ```

  **Response:**

  ```json
  {
    "_id": "user_id",
    "username": "updateduser",
    "role": "admin"
  }
  ```

### Authentication APIs

- **Login**

  `POST /api/auth/login`

  **Request Body:**

  ```json
  {
    "username": "user",
    "password": "password123"
  }
  ```

  **Response:**

  ```json
  {
    "token": "jwt_token"
  }
  ```

- **Logout**

  `POST /api/auth/logout`

  **Response:**

  ```json
  {
    "message": "Logout successful"
  }
  ```

### Group Management APIs

- **Create Group**

  `POST /api/groups`

  **Request Body:**

  ```json
  {
    "name": "New Group"
  }
  ```

  **Response:**

  ```json
  {
    "_id": "group_id",
    "name": "New Group",
    "members": []
  }
  ```

- **Delete Group**

  `DELETE /api/groups/:id`

  **Response:**

  ```json
  {
    "message": "Group deleted"
  }
  ```

- **Add Member to Group**

  `POST /api/groups/add-member`

  **Request Body:**

  ```json
  {
    "groupId": "group_id",
    "userId": "user_id"
  }
  ```

  **Response:**

  ```json
  {
    "_id": "group_id",
    "name": "Group Name",
    "members": ["user_id"]
  }
  ```

### Group Messaging APIs

- **Send Message**

  `POST /api/groups/message`

  **Request Body:**

  ```json
  {
    "groupId": "group_id",
    "senderId": "user_id",
    "content": "Hello, Group!"
  }
  ```

  **Response:**

  ```json
  {
    "_id": "message_id",
    "group": "group_id",
    "sender": "user_id",
    "content": "Hello, Group!",
    "likes": []
  }
  ```

- **Like Message**

  `POST /api/groups/like-message`

  **Request Body:**

  ```json
  {
    "messageId": "message_id",
    "userId": "user_id"
  }
  ```

  **Response:**

  ```json
  {
    "_id": "message_id",
    "group": "group_id",
    "sender": "user_id",
    "content": "Hello, Group!",
    "likes": ["user_id"]
  }
  ```

## Testing

To run the tests and generate a coverage report:

1. **Important Note**: You must set a `TEST_JWT` environment variable with a valid JWT in your `.env` file for the tests to run successfully. Add the following line to your `.env`:

   ```env
   TEST_JWT=your_test_jwt_token
   ```
2. Run tests:

   ```bash
   npm test
   ```

3. Run tests with coverage report:

   ```bash
   npm run test:coverage
   ```
4. After running the tests, you should see a coverage report similar to the image below:

   ![Test Coverage](https://github.com/surjeetlodhirajput/Group-Chat-API/blob/main/tests/testcoverage.png)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.