import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [role, setRole] = useState('passenger'); // Default role
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  console.log(formData,"data")
  const handleRoleChange = (e) => {
    setRole(e.target.value); // Update role when selected from dropdown or radio

  };
  
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      role === 'passenger' ? 'http://localhost:4000/login' :
      role === 'driver' ? 'http://localhost:4000/login' : // Same URL for both passengers and drivers
      'http://localhost:4000/login'; // Adjusted for admin login

   

    try {
      const response = await axios.post(url, formData);
      console.log(response)

      // Check if the user is a valid passenger before redirecting to the passenger dashboard
      if (response.status===200){
        alert('Login successful');
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userId', response.data.user._id)
      console.log("fhg", response.data.user._id)
        if (role === 'passenger') {

          if (response.data.user.role !== 'user') {
            setError('You are not a registered passenger.');
            return; // Prevent redirect
          }
          navigate('/passenger-dashboard');
        }
        // Handle driver and admin redirects
         if (role === 'driver') {
          navigate('/driver-dashboard');
        } 
        else if (role === 'admin') {
          navigate('/admin-dashboard');
        }
      }
     
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

return (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: 'url("https://images.pexels.com/photos/2399254/pexels-photo-2399254.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center'

  }}>
    <div style={{
      width: '350px',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight transparency
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '20px' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>Select Role:</label>
          <select value={role} onChange={handleRoleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="passenger">Passenger</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%'
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%'
          }}
        />
        <button type="submit" style={{
          padding: '10px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#007bff',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          Login
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      <p style={{ marginTop: '15px' }}>
          Not a member? <Link to="/signup" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Sign up today</Link>
        </p>

    </div>
  </div>
);
}

export default Login;
