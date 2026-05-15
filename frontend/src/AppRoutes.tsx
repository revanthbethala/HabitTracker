import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/components/layout/RouteGuards.tsx';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { MainLayout } from '@/components/layout/MainLayout';
import { LandingPage } from '@/pages/LandingPage';
import { Login } from '@/features/auth/Login';
import { Register } from '@/features/auth/Register';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { HabitList } from '@/features/habits/HabitList';
import { HabitDetails } from '@/features/habits/HabitDetails';
import { CreateHabit } from '@/features/habits/CreateHabit';
import { EditHabit } from '@/features/habits/EditHabit';
import { Badges } from '@/features/badges/Badges';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/habits" element={<HabitList />} />
          <Route path="/habits/new" element={<CreateHabit />} />
          <Route path="/habits/:id" element={<HabitDetails />} />
          <Route path="/habits/:id/edit" element={<EditHabit />} />
          <Route path="/badges" element={<Badges />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
