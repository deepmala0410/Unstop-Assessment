import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [numSeats, setNumSeats] = useState('');
  const [reservedSeats, setReservedSeats] = useState([]);
  const [coachSeats, setCoachSeats] = useState(Array(12).fill(null).map((_, row) => row !== 11 ? Array(7).fill(0) : Array(3).fill(0))); // Initial seat layout
  const [error, setError] = useState('');

  // UseEffect to fetch seat data
  useEffect(() => {
    fetchSeats();
  }, []); // We don't need to include `reservedSeats` here as a dependency

  const fetchSeats = async () => {
    try {
      const response = await axios.get('http://13.235.68.225:3002/trainCoach/coachs');
      const { data } = response;
      if (data && data.length > 0) {
        updateCoachSeats(data);
        setError('');
      } else {
        setError('Error occurred while fetching seats.');
      }
    } catch (err) {
      setError('Failed to fetch seat data');
    }
  };

  // Function to handle seat reservation
  const handleReserveSeats = async () => {
    if (numSeats < 1 || numSeats > 7) {
      setError('Please enter a number between 1 and 7.');
      return;
    }
    try {
      const response = await axios.post('http://13.235.68.225:3002/trainCoach/reserve', { numberOfSeats: parseInt(numSeats) });
      const { data } = response;
      if (data && data.data.length > 0) {
        setReservedSeats(data.data);
        updateCoachPostReservation(data.data);
        setError('');
      } else {
        setError('No available seats or some error occurred.');
      }
    } catch (err) {
      setError(err.response.data.message || 'Error reserving seats');
    }
  };

  const handleEmptySeats = async () => {
    try {
      const response = await axios.put('http://13.235.68.225:3002/trainCoach/emptyCoach',{});
      const { data } = response;
      if (data && data.data) {
        await fetchSeats()
        setError(data.message);
      } else {
        setError('Error occurred while doing empty seats.');
      }
    } catch (err) {
      setError('Failed to update seat data');
    }
  };

  // Update seat status in the coach
  const updateCoachPostReservation = (seats) => {
    const newCoachSeats = [...coachSeats];
    seats.forEach((seat, index) => {
      const row = seat.RowNumber;
      const col = seat.SeatNumber;
      newCoachSeats[row][col] = 1;
    });
    setCoachSeats(newCoachSeats);
  };

  const updateCoachSeats = (seats) => {
    const newCoachSeats = [...coachSeats];
    seats.forEach((seat, index) => {
      const row = seat.RowNumber;
      const col = seat.SeatNumber;
      if(seat.BookingStatus)
      newCoachSeats[row][col] = 1;
      else
      newCoachSeats[row][col] = 0;
    });
    setCoachSeats(newCoachSeats);
  };

  // Function to render the seat layout
  const renderCoachSeats = () => {
    console.log(coachSeats)
    return coachSeats.map((row, rowIndex) => (
      <div key={rowIndex} className="seat-row">
        {row.map((seat, seatIndex) => (
          <div
            key={rowIndex}
            className={`seat ${seat == 1 ? 'reserved' : 'available'}`}
          >
            {rowIndex * 7 + seatIndex + 1}          
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>Train Seat Reservation</h1>

      <div className="reservation-form">
        <label>Enter number of seats to reserve (1 to 7):</label>
        <input
          type="number"
          value={numSeats}
          onChange={(e) => setNumSeats(e.target.value)}
        />
        <button style={{padding:"5px",backgroundColor:'lavender', color:'black', margin:'5px', borderRadius:'5px'}} onClick={handleReserveSeats}>Reserve Seats</button>
        <button style={{padding:"5px",backgroundColor:"lightcyan", color:'black', margin:'5px', borderRadius:'5px'}} onClick={handleEmptySeats}>Reset Seats</button>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="seat-layout">
        <h2>Coach Seat Layout</h2>
        {renderCoachSeats()}
      </div>

      {reservedSeats?.length > 0 && (
        <div className="reserved-seats">
          <h3>Reserved Seats:</h3>
          <p>{reservedSeats.map((obj)=>obj.id).join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default App;
