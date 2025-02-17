import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Retrieve admin details from local storage
  const adminName = localStorage.getItem('adminName') || 'Admin';
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@example.com';

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/drivers/available', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        setDrivers(response.data);
      } catch (err) {
        setError('Failed to load drivers');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Function to delete a driver
  const handleDelete = async (driverId) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      await axios.delete(`http://localhost:4000/drivers/${driverId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });

      // Update UI after deletion
      setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver._id !== driverId));
    } catch (err) {
      alert('Failed to delete driver');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: 'white',
        color: 'black',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Hello, {adminName}</h2>
          <p style={{ fontSize: '14px', color: '#555' }}>{adminEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#E74C3C',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px',
            marginTop: '30px'
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Driver Management</h1>
        {loading ? (
          <p style={{ textAlign: 'center', fontSize: '18px', padding: '20px' }}>Loading...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', color: 'red', fontSize: '18px' }}>{error}</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f4f4f4' }}>
                {['Name', 'Email', 'Phone', 'License Number', 'Actions'].map((heading) => (
                  <th key={heading} style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{driver.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{driver.email}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{driver.phone}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{driver.licenseNumber}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleDelete(driver._id)}
                      style={{
                        background: 'red',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
