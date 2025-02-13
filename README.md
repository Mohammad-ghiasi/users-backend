Here's a sample README template for your project:

---

# Project Name: User Management API

## Description
A simple and secure User Management API built using **Node.js** and **Express.js**. This project allows you to manage users by providing functionality to sign up, log in, view user lists, update user details, and delete users. The API uses **JWT authentication** for secure user access.

## Features
- **User Registration**: Create new users with `username`, `password`, `email`, `job`, and `personal information`.
- **User Authentication**: Login functionality using JWT token.
- **User List**: Retrieve all users.
- **User Update**: Update user details like `password`, `job`, `email`, `firstname`, `lastname`.
- **User Deletion**: Delete users by their `userId`.
- **JWT Authentication**: Protects endpoints using JWT token validation.
- **CORS Support**: Configured for cross-origin requests from `http://localhost:3000`.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **API Documentation**: None (Can be added as required)
- **Middleware**: Custom middleware for authorization and user validation
- **CORS**: Configured to allow cross-origin requests from specific frontends.

## Installation

### Prerequisites
- **Node.js**: Version 14 or higher
- **MongoDB**: Local or cloud MongoDB instance (e.g., MongoDB Atlas)
  
### Setup Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/user-management-api.git
   ```

2. Install dependencies:
   ```bash
   cd user-management-api
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```bash
   MONGO_URI=mongodb://your_mongo_connection_url
   SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The API will be running at `http://localhost:3001`.

## Endpoints

### 1. **POST /signup**
Registers a new user.

- **Request body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "job": "developer",
    "firstname": "John",
    "lastname": "Doe"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### 2. **POST /login**
Logs in an existing user and returns a JWT token.

- **Request body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here"
  }
  ```

### 3. **GET /users**
Fetches a list of all users (requires JWT token in the `Authorization` header).

- **Headers**:
  - `Authorization: Bearer <token>`
  
- **Response**:
  ```json
  {
    "users": [
      {
        "email": "user@example.com",
        "job": "developer",
        "firstname": "John",
        "lastname": "Doe",
        "createdAt": "2025-01-23T00:00:00.000Z",
        "updatedAt": "2025-01-23T00:00:00.000Z"
      }
    ]
  }
  ```

### 4. **PUT /updateUsers/:userId**
Update user details like `password`, `job`, `email`, `firstname`, `lastname` by `userId` (requires JWT token).

- **Request body**:
  ```json
  {
    "password": "newPassword",
    "job": "newJob",
    "email": "newemail@example.com",
    "firstname": "Jane",
    "lastname": "Doe"
  }
  ```

- **Response**:
  ```json
  {
    "message": "User updated successfully"
  }
  ```

### 5. **DELETE /deleteUser/:userId**
Deletes a user by their `userId` (requires JWT token).

- **Response**:
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

## Authentication (JWT)
- All routes except `/signup` and `/login` require authentication via JWT.
- On login, a JWT token will be returned which should be included in the `Authorization` header for all protected routes in the format: `Bearer <token>`.

## CORS Configuration
The API supports CORS for the frontend located at `http://localhost:3000`. This allows your frontend application to make API requests from this origin.

## Error Handling
- **401 Unauthorized**: If the JWT token is missing or invalid.
- **400 Bad Request**: If required data is missing in the request.
- **404 Not Found**: If the requested resource does not exist.
- **500 Internal Server Error**: For unexpected errors.

## Notes
- Make sure MongoDB is up and running before using the API.
- The `SECRET` key used for JWT should be kept secure and not exposed.


## Contact
For more information, please contact [mohammadghiasi005@gmail.com].

---

Feel free to modify the content to match the exact details of your project!
