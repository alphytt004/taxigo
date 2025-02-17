import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To use redirection

const SignUp = () => {
  const [role, setRole] = useState('passenger'); // Either 'passenger' or 'driver'
  const [formData, setFormData] = useState({});

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = role === 'passenger' ? 'http://localhost:4000/passenger' : 'http://localhost:4000/driver';
    console.log(formData)
    try {
      const response = await axios.post(url, formData);
      setSuccessMessage(response.data);  // Show success message
      setErrorMessage('');  // Clear any error message
      // setTimeout(() => {
        navigate('/Login'); // Redirect to Login page after successful registration
      // }, 2000); // Wait for a moment before redirecting
    } catch (err) {
      console.error(err);
      setErrorMessage('Error during registration');  // Display error message
      setSuccessMessage('');  // Clear any success message
    }
  };
  
  
  return (
    <div
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/8247/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            color: '#333',
            marginBottom: '20px',
            fontWeight: 'bold',
            fontSize: '22px',
          }}
        >
          {role === 'passenger' ? 'Passenger' : 'Driver'} Registration
        </h2>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              width: '100%',
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              name={role === 'passenger'? 'contactNumber': 'phone'}
              placeholder="Contact Number"
              value={role === 'passenger'? formData.contactNumber : formData.phone}
              onChange={handleChange}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="Other">Other</option>
            </select>

            {role === 'driver' && (
              <>
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="License Number"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="vehicleNumber"
                  placeholder="Vehicle Number"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="vehicleModel"
                  placeholder="Vehicle Model"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    gridColumn: 'span 2', // Makes this input take full width
                  }}
                />
              </>
            )}
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#ffb800',
              color: 'white',
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '20px',
              width: '100%',
            }}
          >
            Register
          </button>
        </form>

        <button
          onClick={() => setRole(role === 'passenger' ? 'driver' : 'passenger')}
          style={{
            background: 'none',
            color: '#ffb800',
            fontSize: '14px',
            marginTop: '15px',
            padding: '5px 10px',
            border: '1px solid #ffb800',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Switch to {role === 'passenger' ? 'Driver' : 'Passenger'} Registration
        </button>

        {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default SignUp;