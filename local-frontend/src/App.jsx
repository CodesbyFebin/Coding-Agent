/**
 * Frontend Command Center - App Component
 * Main application shell with navigation and routing
 */
import { useEffect } from 'react';
import { store } from './store.js';
import { init, loadWorkspaceData } from './main.js';
import { api } from './api/index.js';

export default function App() {
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const unsubscribe = store.onCurrentWorkspaceChange((workspaceId) => {
      if (workspaceId) {
        loadWorkspaceData(workspaceId);
      }
    });
    return () => unsubscribe();
  }, [store.state.currentWorkspace]);

  useEffect(() => {
    if (store.state.error) {
      alert(`Application Error: ${store.state.error}`);
      store.setState({ error: null });
    }
  }, [store.state.error]);

  return (
    <div className="command-center min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tighter">
            <span className="text-indigo-600">CodingAgent</span>
            Command Center
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 rounded"
              title="Refresh"
            >
              ↻
            </button>
            {store.state.isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Welcome, {store.state.user?.username || 'User'}
                </span>
                <button
                  onClick={() => window.location.href '/logout'}
                  className="px-2 py-1 text-xs text-red-600 hover:text-red-800 rounded"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <a
                href="#/"
                className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 rounded"
                title="Login"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {store.state.loading && store.state.user === null ? (
          <div className="p-8 text-center">
            <div className="spinner spinner-lg mx-auto mb-4" />
            <p className="text-gray-500">Initializing CodingAgent Command Center...</p>
          </div>
        ) : store.state.error ? (
          <div className="p-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-b rounded-t-r md:rounded-t-l md:rounded-b-l">
            <p className="font-medium">{store.state.error}</p>
          </div>
        ) : !store.state.currentWorkspace ? (
          <div className="p-8 text-center">
            <h2 className="text-xl font-medium mb-4">Workspaces</h2>
            <p className="text-gray-600">Select a workspace to begin</p>
            <button
              className="mt-4 px-4 py-2 text-sm text-indigo-600 bg-indigo-100 rounded hover:bg-indigo-200"
            >
              Connect Workspace
            </button>
          </div>
        ) : null}

        <div id="app-content" className="mt-6">
          {store.state.currentMission && store.state.currentMission.id ? (
            <MissionDetail mission={store.state.currentMission} workspaceId={store.state.currentWorkspace} />
          ) : (
            <MissionList missions={store.state.missions} workspaceId={store.state.currentWorkspace} />
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white shadow-sm pt-4">
        <div className="max-w-7xl mx-auto px-4 py-2 text-center text-xs text-gray-500">
          <span>CodingAgent Command Center v1.0.0</span>
          <span className="ml-2">•</span>
          <span>Evidence-led verification & tool governance</span>
        </div>
      </footer>
    </div>
  );
}