
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [driver, setDriver] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const navigate = useNavigate();

  // ✅ Extract Driver ID from JWT Token
  const getDriverIdFromToken = () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debugging

    if (!token) {
      console.error('No token found.');
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT Token
      console.log('Decoded Token Payload:', payload); // Debugging

      return payload.id; // Ensure backend sends 'id' in the token
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  useEffect(() => {
    const driverId = getDriverIdFromToken();
    if (!driverId) {
      console.error('Driver ID not found. Redirecting to login.');
      navigate('/login');  // ✅ Redirect user if no valid ID
      return;
    }

    // ✅ Fetch driver details
    fetch(`http://localhost:4000/driver/${driverId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setDriver(data))
      .catch((err) => console.error('Error fetching driver details:', err));

    // ✅ Fetch ride requests for this driver
    fetch(`http://localhost:4000/booking/driver/${driverId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error('Error fetching bookings:', err));

    // ✅ Fetch ride history for this driver
    fetch(`http://localhost:4000/ride-history/driver/${driverId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setRideHistory(data))
      .catch((err) => console.error('Error fetching ride history:', err));
  }, []);

  const handleResponse = (id, status) => {
    fetch(`http://localhost:4000/booking/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then(() => {
        alert(`Booking ${status}`);
        setBookings((prev) => prev.filter((b) => b._id !== id));

        if (status === 'accepted') {
          const acceptedRide = bookings.find((b) => b._id === id);
          setRideHistory((prev) => [...prev, acceptedRide]);
        }
      })
      .catch((err) => console.error('Error updating booking status:', err));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '250px', padding: '20px', background: '#f4f4f4' }}>
        <h2>Welcome, {driver?.name || 'Driver'}</h2>
        <p><strong>Email:</strong> {driver?.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {driver?.phone || 'N/A'}</p>
        <p><strong>Vehicle:</strong> {driver?.vehicle || 'N/A'}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Driver Dashboard</h1>

        <h2>Ride Requests</h2>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking._id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
              <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
              <p><strong>Dropoff:</strong> {booking.dropoffLocation}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {booking.time}</p>
              <button onClick={() => handleResponse(booking._id, 'accepted')} style={{ marginRight: '10px' }}>Accept</button>
              <button onClick={() => handleResponse(booking._id, 'rejected')}>Reject</button>
            </div>
          ))
        ) : (
          <p>No ride requests available.</p>
        )}

        <h2>Ride History</h2>
        {rideHistory.length > 0 ? (
          <ul>
            {rideHistory.map((ride, index) => (
              <li key={index}>
                {ride.pickupLocation} to {ride.dropoffLocation} on {new Date(ride.date).toLocaleDateString()} at {ride.time}
              </li>
            ))}
          </ul>
        ) : (
          <p>No completed rides yet.</p>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
