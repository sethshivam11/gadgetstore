# Overview

This project is all about an ecommerce store which sells gadgets. This project was made by Shivam Soni by using MERN Stack by using Vite. It stores user login data and stores it in MongoDB by hashing the password using bcyptjs. On login user is provided with a token which is saved in localstorage of the user. User's can update their details if they want and it displays the user's transactions, orders, saved addresses which is saved in the DB. 



# To build the project

npm run build


# To run the project

npm start



# Environment variables

1.  PORT - The web app runs on this port

2.  NODE_ENV - Shows users a message if it is not in production mode

3.  MONGODB_URI - This is the MongoDB atlas url where the DB is located and data is saved

4.  VITE_HOST - This tells the website on which url it is deployed

5.  JWT_SECRET - This is a secret message for jsonwebtoken to be sent to user and will be verified

6. RAZORPAY_KEY_ID - Get the razorpay key id from [Razorpay](https://razorpay.com)

7. RAZORPAY_KEY_SECRET - Get the razorpay key secret from [Razorpay](https://razorpay.com)

8. CORS_ORIGIN - Your frontend URL

# Dependenies

1.  bcryptjs - This is used to hash the password input by the user

2.  dotenv - This stores secret details such as environment variables

3.  express - This is the server on which the backend is made

4.  express-validator - This verifies that entries by the user are in a valid format

5.  jsonwebtoken - This provides user a unique token so that they doesn't have to login again and again

6.  mongoose - This is used to connect the backend to the MongoDB

7.  vite - This is a frontend tool to enhance development experience