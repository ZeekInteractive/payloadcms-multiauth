// src/customRoutes.tsx
import React from 'react'
import Route from 'react-router-dom'
import Login from './components/views/Login'

const CustomLoginRoute: React.FC = () => <Route path="/2fa-login" Component={Login} />

export default CustomLoginRoute
