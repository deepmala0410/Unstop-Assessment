const db = require('./index');

// Function to find a row with enough available seats to meet the reservation request
const groupSeatsByRow = async (noOfSeats) => {
    const [rows] = await db.query(
        `SELECT RowNumber
        FROM Coaches
        WHERE BookingStatus = false
        GROUP BY RowNumber
        HAVING COUNT(*) >= ${noOfSeats}
        LIMIT 1;`
    );
    return rows;
};

// Function to get the specified number of available seats in a given row
const getAvailableSeats = async (rowNo, noOfSeats) => {
    const [rows] = await db.query(
        `SELECT id, SeatNumber, RowNumber, BookingStatus 
        FROM Coaches 
        WHERE BookingStatus = FALSE AND RowNumber = ${rowNo} 
        LIMIT ${noOfSeats}`
    );
    return rows;
};

// Function to reserve the seats by updating the booking status to TRUE for the specified seat IDs
const reserveSeats = async (seatIds) => {
    const [result] = await db.query(
        `UPDATE Coaches 
        SET BookingStatus = TRUE 
        WHERE id IN (${seatIds})`
    );
    return result;
};

// Function to search for the nearest available seats when enough seats aren't available in one row
const searchNearbyAvailable = async (numberOfSeats) => {
    const [result] = await db.query(
        `SELECT id, SeatNumber, RowNumber, BookingStatus 
        FROM Coaches 
        WHERE BookingStatus = FALSE 
        LIMIT ${numberOfSeats}`
    );
    return result;
};

// Export the functions to use in other parts of the application
module.exports = {
    getAvailableSeats,
    reserveSeats,
    groupSeatsByRow,
    searchNearbyAvailable
};
