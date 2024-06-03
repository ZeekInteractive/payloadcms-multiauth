// src/customRoutes.tsx
import React from 'react'
import { Route } from 'react-router-dom'
import Login from './components/views/Login'

const CustomLoginRoute: React.FC = () => <Route path="/login-2fa" Component={Login} />

export default CustomLoginRoute
