import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to profile details page
    navigate('/profile/details', { replace: true });
  }, [navigate]);

  return null;
};