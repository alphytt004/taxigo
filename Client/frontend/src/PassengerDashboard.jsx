import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PassengerDashboard = () => {
  const [user, setUser] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch user details
    fetch('http://localhost:4000/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user:', err));

    // Fetch ride history
    fetch(`http://localhost:4000/ride-history/user/${localStorage.getItem("userId")}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRideHistory(data))
      .catch((err) => console.error('Error fetching ride history:', err));

    // Fetch current ride details
    fetch('http://localhost:4000/current-ride', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(rideHistory);
        setCurrentRide(data);console.log(data)})
      .catch((err) => console.error('Error fetching current ride:', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', margin: 0, padding: 0 }}>
      {/* Sidebar */}
      <div style={{ width: '280px', padding: '20px', background: '#ffffff', borderRight: '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '15px', color: '#333' }}>Welcome, {user?.name || 'Guest'}</h2>
        <p style={{ margin: '5px 0' }}><strong>Email:</strong> {user?.email || 'N/A'}</p>
        <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
        <button 
          onClick={handleLogout} 
          style={{ 
            padding: '10px', 
            width: '100%', 
            background: '#e74c3c', 
            color: '#fff', 
            border: 'none', 
            cursor: 'pointer', 
            marginTop: '15px', 
            borderRadius: '5px' 
          }}
          onMouseOver={(e) => e.target.style.background = '#c0392b'}
          onMouseOut={(e) => e.target.style.background = '#e74c3c'}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>Passenger Dashboard</h1>

        {/* "Book Now" Button */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => navigate('/booking')}
            style={{ 
              padding: '12px 20px', 
              background: '#28a745', 
              color: '#fff', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              border: 'none', 
              transition: '0.3s ease' 
            }}
            onMouseOver={(e) => e.target.style.background = '#218838'}
            onMouseOut={(e) => e.target.style.background = '#28a745'}
          >
            Book Now
          </button>
        </div>

        {/* Current Ride Status */}

{currentRide ? (
  <div style={{ 
    marginBottom: '20px', 
    background: '#fff', 
    padding: '20px', 
    borderRadius: '10px', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
  }}>
    <h3 style={{ marginBottom: '15px', color: '#333'}}>Current Ride</h3>
    <table style={{ 
      width: '100%', 
      borderCollapse: 'collapse', 
      borderRadius: '10px', 
      overflow: 'hidden' 
    }}>
      <thead>
        <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
          <th style={{ padding: '12px', textAlign: 'left' }}>From</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>To</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Driver</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ background: '#fff', borderBottom: '1px solid #ddd' }}>
          <td style={{ padding: '12px' }}>{currentRide.pickupLocation}</td>
          <td style={{ padding: '12px' }}>{currentRide.dropoffLocation}</td>
          <td style={{ padding: '12px' }}>{currentRide.driverId ? currentRide.driverId.name : "Driver not assigned yet"}</td>
          <td style={{ padding: '12px' }}>{currentRide.status}</td>
        </tr>
      </tbody>
    </table>
  </div>
) : (
  <p style={{ color: '#777', textAlign: 'center', padding: '10px' }}>No current ride found.</p>
)}


       {/* Ride History Table */}
<div style={{ 
  background: '#fff', 
  padding: '20px', 
  borderRadius: '10px', 
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)', 
  overflowX: 'auto' 
}}>
  <h3 style={{ marginBottom: '10px', color: '#333' }}>Ride History</h3>
  
  {rideHistory.length > 0 ? (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f2f2f2' }}>
          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Pickup</th>
          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Dropoff</th>
          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date</th>
          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Time</th>
          
        </tr>
      </thead>
      <tbody>
        {rideHistory.map((ride, index) => (
          <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '10px' }}>{ride.pickupLocation}</td>
            <td style={{ padding: '10px' }}>{ride.dropoffLocation}</td>
            <td style={{ padding: '10px' }}>{ride.date.slice(0, 10)}</td>
            <td style={{ padding: '10px' }}>{ride.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p style={{ color: '#777' }}>No rides booked yet.</p>
  )}
</div>

      </div>
    </div>
  );
};

export default PassengerDashboard;
