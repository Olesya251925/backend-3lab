# Authentication with Express and MongoDB

Welcome to the project based on **Node.js**, **Express**, and **MongoDB**! This application provides user authentication functionality with different roles: **student** and **teacher**.

## Project Description

This application organizes the project structure and includes the following features:

- **User Registration**: Users can register by providing the following fields:
  - First Name
  - Last Name
  - Username
  - Password

- **Authorization**: Users can log in using their username and password, allowing them to receive a token for access to protected routes.

- **Get User Information**: Users can request their data, including their first name, last name, and username.

- **Delete User**: A function for permanently deleting the user from the database is implemented.

## Technologies

- **Node.js**: For server-side development.
- **Express**: For creating the API.
- **MongoDB**: For storing user data.
- **Mongoose**: For working with MongoDB.
- **JWT**: For secure authentication.

## API Methods

1. **Registration** (POST)  
   `http://localhost:3000/api/auth/register`  
   Register a new user by providing first name, last name, username, and password.

2. **Login** (POST)  
   `http://localhost:3000/api/auth/login`  
   Authenticate by using your username and password.

3. **Get User Information** (GET)  
   `http://localhost:3000/api/auth/me?login=your_username`  
   Retrieve information about your account.

4. **Delete User** (DELETE)  
   `http://localhost:3000/api/auth/delete`  
   Permanently delete your account from the database.

To run the project, you need to install the necessary dependencies and start the project with the command `yarn run dev`.
