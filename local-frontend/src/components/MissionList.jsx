/**
 * Frontend Command Center - Mission List Component
 * Displays list of missions with status indicators and actions
 */
import { useEffect, useState } from 'react';
import { api } from '../api/index.js';
import { store } from '../store/store.js';

function MissionList({ missions, workspaceId }) {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMissions();
  }, [missions]);

  const loadMissions = async () => {
    setRefreshing(true);
    try {
      const data = await api.missions.getMissions(workspaceId);
      store.setState({ missions: data });
    } catch (error) {
      console.error('Failed to load missions:', error);
      store.setState({ error: error.message });
    } finally {
      setRefreshing(false);
    }
  };

  const createMission = async () => {
    const title = prompt('Enter mission title:');
    if (!title) return;
    const description = prompt('Enter mission description (optional):');
    if (!description) description = '';
    try {
      const newMission = await api.missions.createMission(workspaceId, title, description);
      await loadMissions();
      store.setState({ currentMission: newMission });
    } catch (error) {
      console.error('Failed to create mission:', error);
      alert(`Failed to create mission: ${error.message}`);
    }
  };

  const selectMission = async (missionId) => {
    try {
      const mission = await api.missions.getMission(workspaceId, missionId);
      store.setState({ currentMission: mission });
    } catch (error) {
      console.error('Failed to load mission:', error);
      alert(`Failed to load mission: ${error.message}`);
    }
  };

  const deleteMission = async (missionId) => {
    if (!confirm('Are you sure you want to delete this mission?')) return;
    try {
      await api.missions.cancelMission(workspaceId, missionId);
      await loadMissions();
    } catch (error) {
      console.error('Failed to delete mission:', error);
      alert(`Failed to delete mission: ${error.message}`);
    }
  };

  if (store.state.loading) {
    return (
      <div className="p-8 text-center">
        <div className="spinner spinner-lg mx-auto mb-4" />
        <p>Loading missions...</p>
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-gray-500 mb-2">No Missions</h3>
        <p className="text-gray-400">Create your first mission using the button below</p>
        <button
          onClick={createMission}
          className="mt-4 px-4 py-2 text-sm text-indigo-600 bg-indigo-100 rounded hover:bg-indigo-200"
        >
          Create Mission
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">
          <span className="text-indigo-600">Missions</span> ({missions.length})
        </h2>
        <button
          onClick={createMission}
          className="px-3 py-1 text-xs text-indigo-600 rounded hover:bg-indigo-100"
          title="Create Mission"
        >
          + New
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {missions.map((mission) => (
          <div
            key={mission.id}
            onClick={() => selectMission(mission.id)}
            className="cursor-pointer p-3 rounded-lg hover:bg-indigo-50 transition-colors"
            style={{ borderLeft: `4px solid ${getStatusColor(mission.status)}` }}
          >
            <div className="flex w-full justify-between">
              <span className="font-medium truncate w-64">{mission.title}</span>
              <span className="text-xs font-semibold text-{color}">
                {mission.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">
              {mission.description || 'No description'}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {mission.current_step > 0 && (
                <span className="text-xs text-gray-500">
                  Step {mission.current_step}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    planned: 'indigo-500',
    in_progress: 'yellow-500',
    complete: 'green-500',
    failed: 'red-500',
    verified: 'teal-500',
    cancelled: 'gray-500',
  };
  return colors[status] || 'gray-500';
}

export default MissionList;