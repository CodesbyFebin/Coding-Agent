/**
 * Task Graph Planner - Dynamically generated task dependencies
 */
const { v4: uuidv4 } = require('uuid');

const generateTaskGraph = async (missionId, workspaceId, missionConfig, steps) => {
  try {
    const { userId } = req.user;
  } catch {}

  const taskNodes = [];
  const dependencies = [];

  // Generate task nodes from mission steps
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const nodeId = uuidv4();
    
    // Determine dependencies based on step index
    const deps = [];
    if (i > 0) {
      // Previous step depends on
      deps.push({
        id: uuidv4(),
        target: taskNodes[i - 1].id,
        type: 'completion'
      });
    }
    
    // Add explicit dependencies from step config
    if (step.dependencies) {
      step.dependencies.forEach(depId => {
        deps.push({ id: uuidv4(), target: depId, type: 'completion' });
      });
    }
    
    // Detect cycles (simplified)
    const cycleDetected = deps.some(d => 
      taskNodes.slice(0, i).some(t => t.id === d.target)
    );
    
    if (cycleDetected) {
      // Remove the dependency that causes the cycle
      deps.pop();
    }
    
    const taskNode = {
      id: nodeId,
      workspace_id: workspaceId,
      mission_id: missionId,
      title: step.title || `Task ${i + 1}`,
      description: step.description || '',
      type: step.type || 'task',
      status: 'pending',
      dependencies: deps,
      input: step.input || {},
      output: null,
      status_info: {},
      created_at: new Date(),
    };
    
    taskNodes.push(taskNode);
    dependencies.push(...deps);
  }

  // Store task nodes in database
  for (const task of taskNodes) {
    await req.db('task_nodes').insert({
      id: task.id,
      workspace_id: workspace.id,
      mission_id: missionId,
      title: task.title,
      description: task.description,
      type: task.type,
      status: task.status,
      dependencies: JSON.stringify(task.dependencies),
      input: JSON.stringify(task.input),
      created_at: task.created_at,
    });
  }

  return {
    taskNodes,
    dependencies,
    executionOrder: computeExecutionOrder(taskNodes),
  };
};

const computeExecutionOrder = (taskNodes) => {
  // Topological sort
  const sorted = [];
  const visited = new Set();
  const visiting = new Set();

  const visit = (nodeId) => {
    if (visiting.has(nodeId)) {
      // Cycle detected - break it
      return;
    }
    if (visited.has(nodeId)) {
      return;
    }
    
    visiting.add(nodeId);
    
    const node = taskNodes.find(t => t.id === nodeId);
    if (!node) return;
    
    // Visit dependencies first
    node.dependencies.forEach(dep => {
      visit(dep.target);
    });
    
    visiting.delete(nodeId);
    visited.add(nodeId);
    sorted.push(node);
  };

  taskNodes.forEach(node => visit(node.id));
  
  return sorted;
};

module.exports = { generateTaskGraph, computeExecutionOrder };