import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from "./components/ProtectedRoute";
import Moods from './pages/Moods';
import AddMood from './pages/AddMood';
import EditMood from './pages/EditMood';
import Habits from './pages/Habits';
import AddHabit from './pages/AddHabit';
import EditHabit from "./pages/EditHabit";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/moods" element={<ProtectedRoute><Moods /></ ProtectedRoute>} />
          <Route path="/moods/add" element={<ProtectedRoute><AddMood /></ProtectedRoute>} />
          <Route path="/moods/edit/:id" element={<ProtectedRoute><EditMood /></ProtectedRoute>} />
          <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
          <Route path="/habits/add" element={<ProtectedRoute><AddHabit /></ProtectedRoute>} />
          <Route path="/habits/edit/:id" element={<ProtectedRoute><EditHabit /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}