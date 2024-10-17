// routes/userRoutes.js
const express = require('express');
const Coach = require('../models/coach');
const seats = require('../models/seats');
const router = express.Router();

  // Get all Coach
router.get('/coachs', async (req, res) => {
  try {
    const coach = await Coach.findAll();
    res.json(coach);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Empty the coach
router.put('/emptyCoach', async (req, res) => {
  try {
      let result=await seats.emptyCoach();
      res.json({message:'Coach is empty' , data: result});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to fill the coach database with 80 seat entries
router.post('/coach', async (req, res) => {
  try {
    let seatEntry;

    // Loop through the first 11 rows (0-10) where each row has 7 seats
    for (let row = 0; row < 11; row++) {
      for (let seat = 0; seat < 7; seat++) {
        let seatData = { "SeatNumber": seat, "RowNumber": row };
        seatEntry = await Coach.create(seatData);
      }
    }

    // Last row (row 11) has only 3 seats
    for (let seat = 0; seat < 3; seat++) {
      let seatData = { "SeatNumber": seat, "RowNumber": 11 };
      seatEntry = await Coach.create(seatData);
    }

    // Respond with success and the last seat entry created
    res.status(200).json(seatEntry);
  } catch (err) {
    // Handle any errors and respond with an error message
    res.status(400).json({ error: err.message });
  }
});

// API to reserve seats based on the user's request
router.post('/reserve', async (req, res) => {
  const { numberOfSeats } = req.body;

  // Validate the number of seats requested
  if (numberOfSeats < 1 || numberOfSeats > 7) {
    return res.status(400).json({ message: 'You can only reserve between 1 and 7 seats.' , data:[]});
  }

  try {
    // Step 1: Try to find available seats in the same row
    const availableSeatsInRow = await seats.groupSeatsByRow(numberOfSeats);
    const availableRowNumbers = availableSeatsInRow.map((row) => row.RowNumber);
    
    if (availableRowNumbers.length > 0) {
      // Fetch available seats in the same row
      const availableSeats = await seats.getAvailableSeats(availableRowNumbers, numberOfSeats);
      let seatIds = availableSeats.map((seat) => seat.id);
      
      // If no seats are available in the same row
      if (seatIds.length === 0) {
        return res.status(400).json({ message: `No Seats Available`, data:[] });
      }

      // If the available seats are less than requested
      if (seatIds.length < numberOfSeats) {
        return res.status(400).json({
          message: `Available seats: ${seatIds.length}. Please select less than or equal to available seats for booking.`,
          data:[]
        });
      }

      // Reserve seats in the same row and respond with success
      await seats.reserveSeats(seatIds);
      return res.status(200).json({ message: `Booking Successful`, data: availableSeats });
    }

    // Step 2: If no seats are available in the same row, look for nearby seats
    const nearbyAvailableSeats = await seats.searchNearbyAvailable(numberOfSeats);
    let nearbySeatIds = nearbyAvailableSeats.map((seat) => seat.id);

    // If no nearby seats are available
    if (nearbySeatIds.length === 0) {
      return res.status(400).json({ message: `No Seats Available` ,data:[]});
    }

    // If nearby available seats are less than requested
    if (nearbySeatIds.length < numberOfSeats) {
      return res.status(400).json({
        message: `Available seats: ${nearbySeatIds.length}. Please select less than or equal to available seats for booking.`,
        data:[]
      });
    }

    // Reserve nearby seats and respond with success
    await seats.reserveSeats(nearbySeatIds);
    return res.status(200).json({ message: `Booking Successful`, data: nearbyAvailableSeats });
  } catch (err) {
    return res.status(500).json({ message: 'An error occurred during the booking process.', data: err.message });
  }
});

module.exports = router;
