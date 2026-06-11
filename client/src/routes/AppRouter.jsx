import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import LRPage from '../pages/dashboard/LRPage';
import LoadingPage from '../pages/dashboard/LoadingPage';
import LoadingInvoicesPage from '../pages/dashboard/LoadingInvoicesPage';
import InvoicesPage from '../pages/dashboard/InvoicesPage';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Auth Routes with AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
        </Route>

        {/* Admin Login (Standalone UI) */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="lr" element={<LRPage />} />
            <Route path="lr/:id" element={<LRPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="loading" element={<LoadingPage />} />
            <Route path="loading/:id" element={<LoadingPage />} />
            <Route path="loading-invoices" element={<LoadingInvoicesPage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
