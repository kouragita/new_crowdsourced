import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RoleBasedRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const response = await axios.get('/user/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const { role } = response.data;

        if (role === 'Admin') navigate('/admin');
        else if (role === 'Contributor') navigate('/contributor');
        else navigate('/');

      } catch (err) {
        console.error('Error fetching role:', err);
        navigate('/login');
      }
    };

    checkRole();
  }, [navigate]);

  return null; // This component only performs a redirect
};

export default RoleBasedRedirect;
