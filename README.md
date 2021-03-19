# TripList API

https://triplist-app.vercel.app/

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Description

TripList is a place to store all of your trip ideas in one place. Create different lists for your different trips. 

The backend includes error handeling and logging, brcypt encryption, and JWT authentication.

## Technology Used

This is a fullstack app using React, CSS, Node, Express, and PostgreSQL.

## ENDPOINTS

The backend allows users to create an account and store their lists and items in the database. 

/register - Uses bcrypt to encrypt the uses password in the database. 

/login - Creates a JWT token at login for authentication. 

/verifyId, /verifyLists, /verifyItems - Uses JWT to seed the content when a user logs in. 

/lists, /items - These are used to add and delete content.

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

Backend was deployed to Heroku.