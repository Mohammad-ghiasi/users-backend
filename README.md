# User Management API  

## Description  
A **simple and secure User Management API** built with **Node.js** and **Express.js**. This project provides functionalities for user registration, login, retrieving user lists, updating user details, and deleting users. Authentication is handled using **JWT**.  

## Features  
- **User Registration**: Create a new user with `username`, `password`, `email`, `job`, and personal information.  
- **User Authentication**: Login functionality with **JWT token** authentication.  
- **User List**: Retrieve all registered users.  
- **User Update**: Update user details like `password`, `email`, `job`, `firstname`, and `lastname`.  
- **User Deletion**: Delete a user using `userId`.  
- **Address CRUD**: CRUD on users address .  

- **JWT Authentication**: Protects sensitive routes with JWT verification.  
- **CORS Support**: Allows cross-origin requests from `http://localhost:3000 | ...`.  

## Tech Stack  
- **Node.js** and **Express.js** for backend development.  
- **MongoDB** and **Mongoose** for database management.  
- **JWT** for authentication and security.  
- **Custom Middleware** for authorization and validation.  
- **CORS** configured to allow specific frontend requests.  

## Installation & Setup  

### Prerequisites  
- **Node.js** (version 14 or higher)  
- **MongoDB** (local instance or cloud service like **MongoDB Atlas**)  

### Steps to Install  
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
The API will be available at `http://localhost:3001`.  

## Authentication & Security  
- All routes **except** `/signup` and `/login` require JWT authentication.  
- After a successful login, a **JWT token** will be provided, which must be included in the **Authorization** header for protected routes.  

## Error Handling  
- **401 Unauthorized**: If the JWT token is missing or invalid.  
- **400 Bad Request**: If required data is missing in the request.  
- **404 Not Found**: If the requested resource does not exist.  
- **500 Internal Server Error**: For unexpected server issues.  

## Contact  
For more information, feel free to reach out: **mohammadghiasi005@gmail.com**  