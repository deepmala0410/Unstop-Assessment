// app.js
const express = require('express');
const bodyParser = require('body-parser');
const coachRoutes = require('./routes/coachRoutes');
const sequelize = require('./models/index'); // Importing Sequelize connection

const app = express();
const cors = require('cors')

app.use(cors())

// Middleware to parse JSON
app.use(bodyParser.json());

// Use the user routes
app.use('/trainCoach', coachRoutes);

// Sync the database
sequelize.sync().then(() => {
  console.log('Database & tables created!');
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
