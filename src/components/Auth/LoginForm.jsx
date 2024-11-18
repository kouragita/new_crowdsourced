import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaGoogle } from 'react-icons/fa'; // Import Google icon

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://e-learn-ncux.onrender.com/auth/login', { username, password });
      const { token, role } = response.data;

      localStorage.setItem('token', token); 

      // Navigate based on user role
      if (role === 'Admin') navigate('/admin');
      else if (role === 'Contributor') navigate('/contributor');
      else navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://accounts.google.com/InteractiveLogin/signinchooser?service=mail';
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Google Sign-in Button */}
      <button type="button" onClick={handleGoogleLogin} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <FaGoogle style={{ marginRight: '10px' }} /> Sign in with Google
      </button>

      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Login</button>

      <p style={{ marginTop: '10px' }}>
        Don't have an account?{' '}
        <Link to="/signup">Sign Up</Link>
      </p>
    </form>
  );
};

export default LoginForm;