import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute, PublicOnlyRoute } from '../components/ProtectedRoute';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { WorkspaceListPage } from '../features/workspaces/WorkspaceListPage';
import { WorkspaceDetailPage } from '../features/workspaces/WorkspaceDetailPage';
import { MissionListPage } from '../features/missions/MissionListPage';
import { MissionDetailPage } from '../features/missions/MissionDetailPage';
import { AnalyticsPage } from '../features/analytics/AnalyticsPage';
import { NotFoundPage } from '../components/NotFoundPage';

export const AppRoutes = () => (
  <Routes>
    {/* Public-only routes: redirect authed users to /workspaces */}
    <Route element={<PublicOnlyRoute />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    {/* Protected routes: require auth, render inside MainLayout */}
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/workspaces" element={<WorkspaceListPage />} />
        <Route
          path="/workspaces/:workspaceId"
          element={<WorkspaceDetailPage />}
        />
        <Route
          path="/workspaces/:workspaceId/missions"
          element={<MissionListPage />}
        />
        <Route
          path="/workspaces/:workspaceId/missions/:missionId"
          element={<MissionDetailPage />}
        />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
