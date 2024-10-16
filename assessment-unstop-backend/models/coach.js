// models/coach.js
const Sequelize = require('sequelize');
const sequelize = require('./index');  // Importing connection

const Coach = sequelize.define('Coach', {
    SeatNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    RowNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    BookingStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

module.exports = Coach;
