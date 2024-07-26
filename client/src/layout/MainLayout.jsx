import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function MainLayout() {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
        navigate('/login', { replace: true }); // Redirect to login page if no token is found in local storage
      } else {
    }
  }, [])

  return (
    <div>
        <Outlet/>
    </div>
  )
}
