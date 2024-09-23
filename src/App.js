import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [seats, setSeats] = useState([]);
  const [numSeats, setNumSeats] = useState(1);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [seatToUpdate, setSeatToUpdate] = useState('');
  const [newStatus, setNewStatus] = useState('available');

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    const res = await axios.get('https://unstop-lime.vercel.app/seats');
    setSeats(res.data);
  };

  const bookSeats = async () => {
    try {
      const res = await axios.post('https://unstop-lime.vercel.app/book', { numSeats });
      setBookedSeats(res.data.bookedSeats);
      fetchSeats(); // Refresh seat layout
    } catch (err) {
      alert(err.response.data);
    }
  };

  const updateSeatStatus = async () => {
    try {
      const res = await axios.post('https://unstop-lime.vercel.app/update-seat-status', {
        seatId: parseInt(seatToUpdate),
        status: newStatus,
      });
      alert(res.data.message);
      fetchSeats(); // Refresh seat layout
    } catch (err) {
      alert(err.response.data);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Unstop Booking</h1>
        <p>Book or update seat status with ease!</p>
      </header>

      <div className="container">
        <div className="seats-section">
          <h2>Seat Layout</h2>
          <div className="coach">
            {seats.map((seat) => (
              <div
                key={seat.id}
                className={`seat ${seat.status}`}
              >
                {seat.id}
              </div>
            ))}
          </div>
        </div>

        <div className="booking-section">
          <h2>Book Seats</h2>
          <input
            type="number"
            value={numSeats}
            onChange={(e) => setNumSeats(e.target.value)}
            min="1"
            max="7"
            className="input-box"
          />
          <button onClick={bookSeats} className="btn">Book Seats</button>

          <div>
            <h3>Booked Seats:</h3>
            <p>{bookedSeats.length > 0 ? bookedSeats.join(', ') : 'No seats booked yet.'}</p>
          </div>

          <h2>Update Seat Status</h2>
          <input
            type="number"
            placeholder="Seat ID"
            value={seatToUpdate}
            onChange={(e) => setSeatToUpdate(e.target.value)}
            min="1"
            max="80"
            className="input-box"
          />
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="input-box"
          >
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
          <button onClick={updateSeatStatus} className="btn">Update Status</button>
        </div>
      </div>
    </div>
  );
}

export default App;
