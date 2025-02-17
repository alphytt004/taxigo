import React, { useState, useEffect } from 'react';

const Booking = () => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    date: '',
    time: '',
  });
  const [drivers, setDrivers] = useState([]);
  const [showDrivers, setShowDrivers] = useState(false);
  const [requestedDrivers, setRequestedDrivers] = useState(new Set()); // New state for tracking requested drivers

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchDrivers = async () => {
    try {
      const userToken = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/drivers/available', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const data = await response.json();
      if (response.ok) {
        setDrivers(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleRequestRide = async (driverId) => {
    if (requestedDrivers.has(driverId)) return; // Prevent duplicate requests

    const user = localStorage.getItem('userId');
    if (!user) {
      alert('User ID is missing. Please log in again.');
      return;
    }

    // Validate date and time
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    const currentDateTime = new Date();

    if (selectedDateTime < currentDateTime) {
      alert("You cannot book a ride for a past date or time.");
      return;
    }

    const bookingData = {
      userId: user,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      date: formData.date,
      time: formData.time,
      driverId: driverId,
    };

    try {
      const response = await fetch('http://localhost:4000/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(bookingData),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Ride request sent to the driver!');
        setRequestedDrivers((prev) => new Set(prev).add(driverId)); // Mark driver as requested
      } else {
        alert(`Booking failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error booking ride:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'url(https://images.pexels.com/photos/3652766/pexels-photo-3652766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2) no-repeat center center/cover',
      padding: '20px',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1,
      }}></div>

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '420px',
        width: '100%',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '22px' }}>Book a Ride</h2>

        <input
          type="text"
          name="pickupLocation"
          placeholder="Pickup Location"
          value={formData.pickupLocation}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="text"
          name="dropoffLocation"
          placeholder="Dropoff Location"
          value={formData.dropoffLocation}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          style={inputStyle}
        />

        <button style={buttonStyle} onClick={() => { setShowDrivers(!showDrivers); fetchDrivers(); }}>
          {showDrivers ? "Hide Drivers" : "Show Drivers"}
        </button>

        {showDrivers && (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    {drivers.length > 0 ? (
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        margin: 'auto', 
        maxWidth: '800px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#ff9800', color: 'white' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Gender</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Vehicle</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Number</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map(driver => (
            <tr key={driver._id} style={{ textAlign: 'center' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{driver.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{driver.gender}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{driver.vehicleModel}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{driver.vehicleNumber}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <button
                  onClick={() => handleRequestRide(driver._id)}
                  disabled={requestedDrivers.has(driver._id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: requestedDrivers.has(driver._id) ? '#ccc' : '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: requestedDrivers.has(driver._id) ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {requestedDrivers.has(driver._id) ? "Ride Requested" : "Request Ride"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No drivers available</p>
    )}
  </div>
)}

      </div>
    </div>
  );
};

// Reusable styles
const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  boxSizing: 'border-box',
  fontSize: '16px',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#ff9800',
  color: 'white',
  fontSize: '18px',
  fontWeight: 'bold',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  transition: '0.3s',
};

export default Booking;
