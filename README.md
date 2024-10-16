# Getting Started with TrainCoach Booking App 

## Problem Description:
1. There are 80 seats in a coach of a train with only 7 seats in a row and last row of only 3
seats. For simplicity, there is only one coach in this train.
2. One person can reserve up to 7 seats at a time.
3. If a person is reserving seats, the priority will be to book them in one row.
4. If seats are not available in one row then the booking should be done in such a way that the
nearby seats are booked.
5. User can book as many tickets as s/he wants until the coach is full.
6. You don’t have to create login functionality for this application.

## How it should function?
1. Input required will only be the required number of seats. Example: 2 or 4 or 6 or 1 etc.
2. Output should be seats numbers that have been booked for the user along with the display of
all the seats and their availability status through color or number or anything else that you may
feel fit.

## Get Started

In the project directory, you can run:

Clone this git repository 
```
git clone https://github.com/deepmala0410/Unstop-Assessment.git
```
Navigate to the project directory
```
cd assessment-unstop-frontend && cd assessment-unstop-backend
```
Install the required packages in both directory
```
npm install
```
Update .env file in assessment-unstop-backend and fill the password or other deatils as required
Run the frontend 
```
npm start
```
Run the backend
```
node app.js
```

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.