import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { PublicShell } from '../components/layout/PublicShell';
import { ProtectedRoute, PublicOnlyRoute } from '../components/ProtectedRoute';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ProjectListPage } from '../features/projects/ProjectListPage';
import { ProjectDetailPage } from '../features/projects/ProjectDetailPage';
import { MissionListPage } from '../features/missions/MissionListPage';
import { MissionDetailPage } from '../features/missions/MissionDetailPage';
import { AnalyticsPage } from '../features/analytics/AnalyticsPage';
import { CodePage } from '../features/code/CodePage';
import { TerminalPage } from '../features/terminal/TerminalPage';
import { BrowserPage } from '../features/browser/BrowserPage';
import { MemoryPage } from '../features/memory/MemoryPage';
import { SkillsPage } from '../features/skills/SkillsPage';
import { McpPage } from '../features/mcp/McpPage';
import { SchedulesPage } from '../features/schedules/SchedulesPage';
import { SecurityPage } from '../features/security/SecurityPage';
import { PillarsDirectoryPage } from '../features/pillars/PillarsDirectoryPage';
import { PillarDetailPage } from '../features/pillars/PillarDetailPage';
import { PlatformPage } from '../features/knowledge/PlatformPage';
import { AgentModesPage } from '../features/knowledge/AgentModesPage';
import { LocalRuntimesPage } from '../features/knowledge/LocalRuntimesPage';
import { SecurityMatrixPage } from '../features/knowledge/SecurityMatrixPage';
import { FaqPage } from '../features/knowledge/FaqPage';
import { NotFoundPage } from '../components/NotFoundPage';

export const AppRoutes = () => (
  <Routes>
    {/* Public-only routes: redirect authed users in */}
    <Route element={<PublicOnlyRoute />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    {/* Public knowledge surfaces: indexable, crawlable, no auth gate */}
    <Route element={<PublicShell />}>
      <Route path="/pillars" element={<PillarsDirectoryPage />} />
      <Route path="/pillars/:slug" element={<PillarDetailPage />} />
      <Route path="/platform" element={<PlatformPage />} />
      <Route path="/agent-modes" element={<AgentModesPage />} />
      <Route path="/local-runtimes" element={<LocalRuntimesPage />} />
      <Route path="/security-matrix" element={<SecurityMatrixPage />} />
      <Route path="/faq" element={<FaqPage />} />
      {/* Missions live under projects; send the orphan nav target there */}
      <Route path="/missions" element={<Navigate to="/projects" replace />} />
      {/* Canonical top-level pillar slugs (e.g. /ai-coding-agents, /dpdp-compliance) */}
      <Route path="/:slug" element={<PillarDetailPage />} />
    </Route>

    {/* Protected routes: require auth, render inside MainLayout */}
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectListPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/projects/:projectId/missions" element={<MissionListPage />} />
        <Route path="/projects/:projectId/missions/:missionId" element={<MissionDetailPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/code" element={<CodePage />} />
        <Route path="/terminal" element={<TerminalPage />} />
        <Route path="/browser" element={<BrowserPage />} />
        <Route path="/memory" element={<MemoryPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/mcp" element={<McpPage />} />
        <Route path="/schedules" element={<SchedulesPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Route>

    {/* Backward-compat: /workspaces → /projects */}
    <Route path="/workspaces" element={<Navigate to="/projects" replace />} />
    <Route path="/workspaces/*" element={<Navigate to="/projects" replace />} />

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
