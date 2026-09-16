/**
 * Agent Runtime Controller - Manages agent execution lifecycle
 */
'use strict';

const { v4: uuidv4 } = require('uuid');

const getAgentRuns = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.userId;

    // Check workspace access
    const membership = await req.db('WorkspaceMember')
      .where('workspace_id', workspaceId)
      .where('user_id', userId)
      .first();

    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const runs = await req.db('AgentRun')
      .where('workspace_id', workspaceId)
      .orderBy('created_at', 'desc');

    res.json(runs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent runs' });
  }
};

const createAgentRun = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { missionId, taskId, model, input } = req.body;
    const userId = req.userId;

    // Check workspace access
    const membership = await req.db('WorkspaceMember')
      .where('workspace_id', workspaceId)
      .where('user_id', userId)
      .first();

    if (!membership) return res.status(403).json({ error: 'Access denied' });

    // Verify mission exists and belongs to workspace
    const mission = await req.db('Mission')
      .where('workspace_id', workspaceId)
      .where('id', missionId)
      .first();

    if (!mission) return res.status(404).json({ error: 'Mission not found' });

    const runId = uuidv4();
    await req.db('AgentRun').insert({
      id: runId,
      workspace_id: workspaceId,
      mission_id: missionId,
      task_id: taskId || null,
      model: model || null,
      input: JSON.stringify(input || {}),
      status: 'queued',
      started_at: new Date(),
    });

    // Create execution log entry
    await req.db('ExecutionLog').insert({
      id: uuidv4(),
      agent_run_id: runId,
      workspace_id: workspaceId,
      step: 0,
      status: 'started',
      started_at: new Date(),
    });

    const run = await req.db('AgentRun').where('id', runId).first();
    res.status(201).json(run);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create agent run' });
  }
};

const getAgentRun = async (req, res) => {
  try {
    const { workspaceId, runId } = req.params;
    const userId = req.userId;

    // Check workspace access
    const membership = await req.db('WorkspaceMember')
      .where('workspace_id', workspaceId)
      .where('user_id', userId)
      .first();

    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const run = await req.db('AgentRun')
      .where('workspace_id', workspaceId)
      .where('id', runId)
      .first();

    if (!run) return res.status(404).json({ error: 'Agent run not found' });

    // Fetch execution logs for this run
    const logs = await req.db('ExecutionLog')
      .where('agent_run_id', runId)
      .orderBy('step', 'asc');

    res.json({ ...run, logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent run' });
  }
};

const updateAgentRun = async (req, res) => {
  try {
    const { workspaceId, runId } = req.params;
    const { status, output, error: outputError } = req.body;
    const userId = req.userId;

    // Check workspace access
    const membership = await req.db('WorkspaceMember')
      .where('workspace_id', workspaceId)
      .where('user_id', userId)
      .first();

    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const run = await req.db('AgentRun')
      .where('workspace_id', workspaceId)
      .where('id', runId)
      .first();

    if (!run) return res.status(404).json({ error: 'Agent run not found' });

    const updateData = { status, updated_at: new Date() };
    if (output) updateData.output = JSON.stringify(output);

    await req.db('AgentRun')
      .where('workspace_id', workspaceId)
      .where('id', runId)
      .update(updateData);

    // If task completed, update the corresponding mission step status
    if (run.mission_id && (status === 'completed' || status === 'failed')) {
      const stepStatus = status === 'completed' ? 'completed' : 'failed';
      await req.db('MissionStep')
        .where('mission_id', run.mission_id)
        .where('step_index', run.task_id || 0)
        .update({ status: stepStatus, completed_at: new Date() });
    }

    res.json({ id: runId, status, output, error: outputError });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update agent run' });
  }
};

module.exports = {
  getAgentRuns,
  createAgentRun,
  getAgentRun,
  updateAgentRun,
};
