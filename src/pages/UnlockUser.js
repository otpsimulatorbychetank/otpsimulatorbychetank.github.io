import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function UnlockUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user came from Admin
    if (!location.state || !location.state.user) {
      localStorage.removeItem('adminUser'); // 🧹 Clear stale session
      navigate('/', { replace: true }); // ⬅️ Redirect to Admin
    } else {
      // ✅ Save user to localStorage
      const currentUser = location.state.user;
      setUser(currentUser);
      localStorage.setItem('adminUser', JSON.stringify(currentUser));
    }

    return () => {
      localStorage.removeItem('adminUser'); // Cleanup
    };
  }, [location.state, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/', { replace: true });
  };

  if (!user) {
    return null; // ⏳ Show nothing while redirecting
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.userCard}>
        <span style={styles.closeIcon} onClick={handleLogout}>
          &times;
        </span>
        <img
          src={user.picture}
          alt="Profile"
          style={styles.profilePic}
        />
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  userCard: {
    position: 'relative',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    textAlign: 'center',
    width: '90%',
    maxWidth: '400px',
  },
  profilePic: {
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    marginBottom: '10px',
  },
  button: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  closeIcon: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    fontSize: '1.5rem',
    color: '#888',
    cursor: 'pointer',
  },
};

export default UnlockUser;
