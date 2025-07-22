import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // for navigation to Success page

function GenerateOtp() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const [showValidatePopup, setShowValidatePopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [validateStatus, setValidateStatus] = useState('');
  const [timer, setTimer] = useState(600); // 10 minutes

  const navigate = useNavigate();

  useEffect(() => {
    let countdown;
    if (showValidatePopup && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowValidatePopup(false);
      setOtp(''); // Clear OTP box
      setStatus('❌ OTP expired. Please generate a new OTP.');
    }
    return () => clearInterval(countdown);
  }, [showValidatePopup, timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('❌ Enter a valid email address.');
      return;
    }

    setLoading(true);
    setLoadingMessage('Generating OTP...');
    setStatus('');

    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('action', 'generateotp');
      formData.append('secretkey', 'chetan12345');

      const response = await axios.post(
        'https://script.google.com/macros/s/AKfycbzMbM8LjmS-0bvr99akA-RFj1OpWHUJ4kIAhpDWOXL9jaN5Jh9krMzy79QI62q1a6OmKg/exec',
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (response.data.status === 'success') {
        setStatus('✅ ' + response.data.message);
        setShowValidatePopup(true);
        setTimer(600);
        setValidateStatus('');
      } else {
        setStatus('❌ ' + response.data.message);
      }
    } catch (error) {
      console.error(error);
      setStatus('❌ Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  const handleValidateOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 4) {
      setValidateStatus('❌ Enter a valid 4-digit OTP.');
      return;
    }

    setLoading(true);
    setLoadingMessage('Validating OTP...');
    setValidateStatus('');

    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('action', 'validateotp');
      formData.append('secretkey', 'chetan12345');
      formData.append('otp', otp);

      const response = await axios.post(
        'https://script.google.com/macros/s/AKfycbzMbM8LjmS-0bvr99akA-RFj1OpWHUJ4kIAhpDWOXL9jaN5Jh9krMzy79QI62q1a6OmKg/exec',
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (response.data.status === 'success') {
        setValidateStatus('✅ ' + response.data.message);
        setTimeout(() => {
          setShowValidatePopup(false);
          setOtp(''); // Clear OTP
          navigate('/success'); // Redirect to Success page
        }, 1000);
      } else {
        setValidateStatus('❌ ' + response.data.message);
      }
    } catch (error) {
      console.error(error);
      setValidateStatus('❌ Something went wrong during OTP validation.');
    }

    setLoading(false);
  };

  const handleClosePopup = () => {
    setShowValidatePopup(false);
    setOtp(''); // Clear OTP when closing
  };

  const formatTimer = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div style={styles.pageWrapper}>
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
            {loading && loadingMessage === 'Generating OTP...' ? (
              <span>🔄 Generating OTP...</span>
            ) : (
              'Generate OTP'
            )}
          </button>
        </form>
        {status && <p style={styles.status}>{status}</p>}
      </div>

      {showValidatePopup && (
        <div style={styles.popup}>
          <h3>Enter OTP</h3>
          <p style={styles.timer}>⏳ Time remaining: {formatTimer(timer)}</p>
          <form onSubmit={handleValidateOtp} style={styles.form}>
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ''); // Allow only digits
                if (val.length <= 4) setOtp(val); // Max 4 digits
              }}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading && loadingMessage === 'Validating OTP...' ? (
                <span>🔄 Validating OTP...</span>
              ) : (
                'Validate OTP'
              )}
            </button>
            {validateStatus && <p style={styles.validateStatus}>{validateStatus}</p>}
          </form>
          <button
            style={{ ...styles.button, backgroundColor: '#dc3545', marginTop: '10px' }}
            onClick={handleClosePopup}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f0f2f5',
  },
  container: {
    width: '100%',
    maxWidth: '500px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    backgroundColor: '#fff',
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
    textAlign: 'center',
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
  popup: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    padding: '20px',
    zIndex: 1000,
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  timer: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '10px',
  },
  validateStatus: {
    marginTop: '10px',
    fontSize: '0.95rem',
    color: '#555',
  },
};

export default GenerateOtp;
