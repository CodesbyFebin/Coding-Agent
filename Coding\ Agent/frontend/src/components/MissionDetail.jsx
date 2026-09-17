/**
 * Frontend Command Center - Mission Detail Component
 * Shows detailed view of a single mission with steps, evidence, and controls
 */
import { useEffect, useState } from 'react';
import { api } from './api/index.js';
import { store } from './store.js';

function MissionDetail({ mission, workspaceId }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMissionDetails();
  }, [mission]);

  const loadMissionDetails = async () => {
    try {
      const details = await api.missions.getVerificationDetails(workspaceId, mission.id);
      store.setState({ currentMission: details });
    } catch (error) {
      console.error('Failed to load mission details:', error);
      store.setState({ error: error.message });
    }
    setLoading(false);
  };

  const executeStep = async (stepIndex) => {
    try {
      await api.missions.updateMissionStep(workspaceId, mission.id, stepIndex.toString(), 'in_progress');
      alert(`Step ${stepIndex + 1} execution started`);
    } catch (error) {
      console.error('Failed to execute step:', error);
      alert(`Failed to execute step: ${error.message}`);
    }
  };

  const completeStep = async (stepIndex) => {
    try {
      await api.missions.updateMissionStep(workspaceId, mission.id, stepIndex.toString(), 'complete');
      await api.evidence.createEvidence(workspaceId, mission.id, stepIndex, 'execution', { completed: true });
      await loadMissionDetails();
      alert(`Step ${stepIndex + 1} completed successfully`);
    } catch (error) {
      console.error('Failed to complete step:', error);
      alert(`Failed to complete step: ${error.message}`);
    }
  };

  const failStep = async (stepIndex) => {
    try {
      await api.missions.updateMissionStep(workspaceId, mission.id, stepIndex.toString(), 'failed');
      await loadMissionDetails();
      alert(`Step ${stepIndex + 1} marked as failed`);
    } catch (error) {
      console.error('Failed to fail step:', error);
      alert(`Failed to fail step: ${error.message}`);
    }
  };

  const approveMission = async () => {
    if (!confirm('Approve mission completion?')) return;
    try {
      const approvals = await api.approvals.getApprovalsByMission(workspaceId, mission.id);
      if (approvals.length > 0) {
        const decided = window.confirm(
          `Mission has ${approvals.length} approval(s). Approve?`
        );
        if (decided) {
          const result = await api.approvals.decideApproval(approvals[0].id, 'approve', 'user');
          await loadMissionDetails();
          alert('Mission approved and completed');
        }
      } else {
        await api.missions.verifyMission(workspaceId, mission.id);
        alert('Mission verified and completed');
      }
    } catch (error) {
      console.error('Failed to approve mission:', error);
      alert(`Failed to approve mission: ${error.message}`);
    }
  };

  const cancelMission = async () => {
    if (!confirm('Cancel this mission?')) return;
    try {
      await api.missions.cancelMission(workspaceId, mission.id);
      await api.missions.getMissions(workspaceId);
      store.setState({ currentMission: null });
      alert('Mission cancelled');
    } catch (error) {
      console.error('Failed to cancel mission:', error);
      alert(`Failed to cancel mission: ${error.message}`);
    }
  };

  useEffect(() => {
    loadMissionDetails();
  }, [mission, workspaceId]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="spinner spinner-lg mx-auto mb-4" />
        <p>Loading mission details...</p>
      </div>
    );
  }

  if (!mission) {
    return <div>Mission not found</div>;
  }

  const { status, title, description, steps, evidence, completeSteps, verified } = mission;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter">
            <span className="text-indigo-600">{title}</span>
          </h1>
          {description && <p className="text-gray-500 line-clamp-2">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-{color}">
            {status}
          </span>
          {verified && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
              Verified
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-500">Total Steps</p>
          <p className="text-2xl font-bold">{steps.length || 0}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-2xl font-bold green-600">
            {completeSteps || 0}
          </p>
        </div>
        {status !== 'complete' && status !== 'verified' && status !== 'cancelled' && (
          <div>
            <p className="text-xs text-gray-500">Verified</p>
            <p className="text-2xl font-bold verified">
              {verified ? 'Yes' : 'Pending'}
            </p>
          </div>
        )}
        {status === 'cancelled' && (
          <div>
            <p className="text-xs text-gray-500">Cancelled</p>
            <p className="text-2xl font-bold text-gray-500">Yes</p>
          </div>
        )}
      </div>

      {steps && steps.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-indigo-600 mb-4">
            {steps.length} Step{s: ${steps.length !== 1 ? 's' : ''}}
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {steps.map((step, index) => {
              const stepEvidence = evidence?.filter(e => e.step_index === index) || [];
              const hasEvidence = stepEvidence.length > 0 && stepEvidence.some(e => e.evidence_hash);
              const isComplete = step.status === 'complete';
              const canExecute = status !== 'complete' && status !== 'failed' && status !== 'cancelled';
              
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    isComplete ? 'bg-green-50' : 
                    status === 'failed' ? 'bg-red-50' : 
                    'bg-indigo-50'
                  }`}
                >
                  <div className="flex w-full justify-between items-start">
                    <span className="font-medium">
                      Step {step.step_index + 1}: {step.title || `Step ${step.step_index + 1}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {step.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {step.description || ''}
                  </p>
                  
                  <div className="mt-2 flex gap-2">
                    {hasEvidence && (
                      <span className="text-xs text-green-500">
                        📜 Evidence recorded (hash: {stepEvidence[0]?.evidence_hash?.substring(0, 8)})
                      </span>
                    )}
                    
                    {canExecute && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => executeStep(index)}
                          className="px-2 py-1 text-xs text-indigo-600 rounded hover:bg-indigo-100"
                          title="Execute Step"
                        >
                          ▶
                        </button>
                        <button
                          onClick={() => completeStep(index)}
                          className="px-2 py-1 text-xs text-green-600 rounded hover:bg-green-100"
                          title="Complete Step"
                        >
                          ✓
                        </button>
                      </div>
                    )}
                    
                    {step.status === 'in_progress' && (
                      <span className="text-xs text-yellow-500">Running...</span>
                    )}
                    
                    {step.status === 'failed' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => failStep(index)}
                          className="px-2 py-1 text-xs text-gray-600 rounded hover:bg-gray-100"
                          title="Mark Failed"
                        >
                          ✗
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {evidence && evidence.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-indigo-600 mb-4">
              Evidence Ledger ({evidence.length} records)
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {evidence.map((ev, i) => {
                const hash = ev.evidence_hash ? `${ev.evidence_hash.substring(0, 8)}...` : 'pending';
                return (
                  <div key={i} className="p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">
                      Step {ev.step_index + 1} • {ev.evidence_type} • {hash}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex gap-3">
            {status !== 'complete' && status !== 'failed' && status !== 'cancelled' && (
              <button
                onClick={approveMission}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                title="Approve Mission"
              >
                Approve Mission
              </button>
            )}
            {status !== 'cancelled' && (
              <button
                onClick={cancelMission}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                title="Cancel Mission"
              >
                Cancel
              </button>
            )}
          </div>
          
          {verified && (
            <span className="text-xs text-green-500 ml-auto">
              ✓ Mission Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MissionDetail;