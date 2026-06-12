import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import Register from '../pages/Register'
import Login from '../pages/Login'
import About from '../pages/About'
import Cart from '../pages/Cart'
import ProtectedRoute from './ProtectedRoute'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { current } from '@reduxjs/toolkit'
import OrdersPage from '../pages/OrdersPage'
import ProfilePage from '../pages/ProfilePage'

const Routings = () => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser) });
    return () => unsubscribe()
  }, [])
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/homepage' element={<HomePage />} />
        <Route path='/registerpage' element={<Register />} />
        <Route path='/loginpage' element={<Login />} />
        <Route path='/aboutpage' element={<About />} />
        <Route path='/cart' element={
          <ProtectedRoute user={user}>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path='/orderspage' element={
          <ProtectedRoute user={user}>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path='/profilepage' element={
          <ProtectedRoute user={user}>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default Routings
