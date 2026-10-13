import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Patients } from '../pages/Patients';
import { PatientDetails } from '../pages/PatientDetails';
import { PatientForm } from '../pages/PatientForm';
import { Appointments } from '../pages/Appointments';
import { AppointmentDetails } from '../pages/AppointmentDetails';
import { AppointmentForm } from '../pages/AppointmentForm';
import { DoctorsComingSoon } from '../pages/DoctorsComingSoon';
import { SettingsComingSoon } from '../pages/SettingsComingSoon';
import { NotFound } from '../pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes wrapped in AppLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Patients Routes */}
        <Route path="patients" element={<Patients />} />
        <Route path="patients/new" element={<PatientForm />} />
        <Route path="patients/:id" element={<PatientDetails />} />
        <Route path="patients/:id/edit" element={<PatientForm />} />

        {/* Appointments Routes */}
        <Route path="appointments" element={<Appointments />} />
        <Route path="appointments/new" element={<AppointmentForm />} />
        <Route path="appointments/:id" element={<AppointmentDetails />} />
        <Route path="appointments/:id/edit" element={<AppointmentForm />} />

        {/* Coming Soon Feature Routes */}
        <Route path="doctors" element={<DoctorsComingSoon />} />
        <Route path="settings" element={<SettingsComingSoon />} />
      </Route>

      {/* 404 Handler */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
