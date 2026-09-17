/**
 * MCP Integration - Model Context Protocol server registry and tool invocation
 */
const { Pool } = require('pg');

const mcpServers = {};

const registerMCPServer = async (workspaceId, name, provider, version, tools, endpoint, authConfig) => {
  const serverId = uuidv4();
  
  mcpServers[serverId] = {
    id: serverId,
    workspace_id: workspaceId,
    name,
    provider,
    version,
    tools: tools || [],
    endpoint,
    auth_config: authConfig || {},
    status: 'active',
    registered_at: new Date(),
    last_heartbeat: new Date(),
  };
  
  // Store in database
  await req.db('mcp_servers').insert({
    id: serverId,
    workspace_id: workspaceId,
    name,
    provider,
    version,
    tools: JSON.stringify(tools || []),
    endpoint,
    auth_config: JSON.stringify(authConfig || {}),
    status: 'active',
    registered_at: new Date(),
    last_heartbeat: new Date(),
  });
  
  return mcpServers[serverId];
};

const unregisterMCPServer = async (serverId) => {
  delete mcpServers[serverId];
  await req.db('mcp_servers').where('id', serverId).del();
};

const getMCPServer = async (serverId) => {
  return mcpServers[serverId];
};

const listMCPServers = async (workspaceId) => {
  return Object.values(mcpServers).filter(
    s => s.workspace_id === workspaceId
  );
};

const discoverTools = async (workspaceId, pattern) => {
  const servers = await listMCPServers(workspaceId);
  let tools = [];
  
  servers.forEach(server => {
    server.tools.forEach(tool => {
      if (pattern && !tool.name.includes(pattern)) return;
      tools.push({
        ...tool,
        serverName: server.name,
        serverProvider: server.provider,
      });
    });
  });
  
  return tools;
};

const invokeMCPTool = async (workspaceId, serverId, toolName, input) => {
  const server = mcpServers[serverId];
  if (!server) throw new Error('MCP server not found');
  
  const tool = server.tools.find(t => t.name === toolName);
  if (!tool) throw new Error(`Tool ${toolName} not found on server ${serverId}`);
  
  // Execute through tool gateway policy check first
  const { canExecute } = await checkToolAccess(
    workspaceId, 
    'system', 
    toolName, 
    'mcp', 
    { toolType: 'mcp', input }
  );
  
  if (!canExecute.canExecute) {
    throw new Error(`Tool denied by policy: ${canExecute.reason}`);
  }
  
  // In production, this would make an actual HTTP request to the MCP server
  // For now, simulate the invocation
  return {
    success: true,
    result: `MCP tool ${toolName} invoked on ${server.name} v${server.version}`,
    toolName,
    serverId,
    workspaceId,
    input,
    timestamp: new Date().toISOString(),
  };
};

const updateMCPServerHeartbeat = async (serverId) => {
  const server = mcpServers[serverId];
  if (!server) return null;
  
  server.last_heartbeat = new Date();
  
  await req.db('mcp_servers')
    .where('id', serverId)
    .update({ last_heartbeat: new Date() });
  
  return server;
};

module.exports = {
  registerMCPServer,
  unregisterMCPServer,
  getMCPServer,
  listMCPServers,
  discoverTools,
  invokeMCPTool,
  updateMCPServerHeartbeat,
};