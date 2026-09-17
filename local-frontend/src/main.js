/**
 * Frontend Command Center - Main Application Component
 * Bootstrap the CodingAgent Command Center UI
 * Connects to all backend APIs via the API service
 */
import { store } from './store.js';
import * as api from './api/index.js';
import { useEffect } from 'react';

function initApp() {
  return new Promise((resolve) => {
    try {
      init();
      resolve();
    } catch (e) {
      console.error('initApp error:', e);
      resolve();
    }
  });
}

async function init() {
  store.setState({ loading: true });

  try {
    // Health check
    const health = await api.healthCheck();
    console.log('Backend healthy:', health.status);

    // Load authenticated user
    const user = await api.auth.getCurrentUser();
    store.setState({ user, isAuthenticated: !!user });

    // Load workspaces
    const workspaces = await api.workspaces.getWorkspaces();
    store.setState({ workspaces });

    // Set current workspace
    if (workspaces.length > 0) {
      store.setState({ currentWorkspace: workspaces[0].id });
      await loadWorkspaceData(workspaces[0].id);
    }

    store.setState({ loading: false });
    console.log('CodingAgent Command Center initialized');
  } catch (error) {
    console.error('Failed to initialize:', error);
    store.setState({ error: error.message, loading: false });
  }
}

async function loadWorkspaceData(workspaceId) {
  try {
    const missions = await api.missions.getMissions(workspaceId);
    store.setState({ missions });

    const agents = await api.agents.getAgents(workspaceId);
    store.setState({ agents });

    const models = await api.models.getModels(workspaceId);
    store.setState({ models });

    const skills = await api.skills.getSkills(workspaceId);
    store.setState({ skills });

    const schedules = await api.schedules.getSchedules(workspaceId);
    store.setState({ schedules });

    // Subscribe to events for real-time updates
    await api.events.subscribeEvents(workspaceId);

    store.setState({ currentWorkspace: workspaceId });
  } catch (error) {
    console.error(`Failed to load workspace ${workspaceId} data:`, error);
    store.setState({ error: error.message });
  }
}

export { init, loadWorkspaceData };