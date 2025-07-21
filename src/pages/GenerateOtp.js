import React, { useState } from 'react';
import axios from 'axios';

function GenerateOtp() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Simple frontend email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('❌ Enter a valid email address.');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      // ✅ Use URLSearchParams instead of JSON to avoid CORS preflight
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('action', 'generateotp');
      formData.append('secretkey', 'chetan12345');

      const response = await axios.post(
        'https://script.google.com/macros/s/AKfycbyOnlGFtaIh3PztHC_JlTv4UhOekf-XIbCgSPY2CxFaRQRnSjGEMPWhn00sdOEw6Vwm1A/exec',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.status === 'success') {
        setStatus('✅ ' + response.data.message);
      } else {
        setStatus('❌ ' + response.data.message);
      }
    } catch (error) {
      console.error(error);
      setStatus('❌ Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Generate OTP</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Sending OTP...' : 'Generate OTP'}
        </button>
      </form>
      {status && <p style={styles.status}>{status}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '5vh auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px',
    fontSize: '1rem',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  status: {
    marginTop: '15px',
    fontSize: '0.95rem',
    color: '#555',
  },
};

export default GenerateOtp;