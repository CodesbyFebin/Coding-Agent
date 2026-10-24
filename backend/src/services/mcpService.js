'use strict';
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { checkToolAccess } = require('./toolGateway');

function publicServer(server) {
  if (!server) return null;
  const { auth_config, ...safe } = server;
  return safe;
}
function allowedEndpoint(raw) {
  const url = new URL(raw);
  const allowed = (process.env.MCP_ALLOWED_HOSTS || '').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
  if (url.protocol !== 'https:' || url.username || url.password || url.port && url.port !== '443' || !allowed.includes(url.hostname.toLowerCase())) {
    throw new Error('MCP endpoint must be HTTPS on an explicitly allowed host');
  }
  return url.href;
}
async function requestMcp(endpoint, body, sessionId) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(endpoint,{
      method:'POST',redirect:'error',signal:controller.signal,
      headers:{'Content-Type':'application/json','Accept':'application/json, text/event-stream','MCP-Protocol-Version':'2025-03-26',...(sessionId?{'Mcp-Session-Id':sessionId}:{})},
      body:JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`MCP remote returned HTTP ${res.status}`);
    const type = res.headers.get('content-type') || '';
    const text = await res.text();
    if (text.length > 2_000_000) throw new Error('MCP response too large');
    let response;
    if (type.includes('text/event-stream')) {
      const event = text.split(/\r?\n\r?\n/).find(block=>block.split(/\r?\n/).some(line=>line.startsWith('data:')));
      if (!event) throw new Error('MCP stream did not contain a response');
      response=JSON.parse(event.split(/\r?\n/).filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trim()).join(''));
    } else {
      response=JSON.parse(text);
    }
    return {response,sessionId:res.headers.get('mcp-session-id') || sessionId};
  } finally { clearTimeout(timeout); }
}
async function invokeStreamableHttp(endpoint, toolName, input) {
  const init = await requestMcp(endpoint,{jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'CodingAgent',version:'0.2.0'}}});
  if (init.response.error || !init.response.result) throw new Error('MCP initialize failed');
  const sessionId=init.sessionId;
  // Notification is allowed to yield HTTP 202 without a JSON body.
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),10000);
  try {
    const notified=await fetch(endpoint,{method:'POST',redirect:'error',signal:controller.signal,headers:{'Content-Type':'application/json','Accept':'application/json, text/event-stream','MCP-Protocol-Version':'2025-03-26',...(sessionId?{'Mcp-Session-Id':sessionId}:{})},body:JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'})});
    if (!notified.ok) throw new Error(`MCP initialization notification failed: ${notified.status}`);
  } finally { clearTimeout(timeout); }
  const called=await requestMcp(endpoint,{jsonrpc:'2.0',id:2,method:'tools/call',params:{name:toolName,arguments:input || {}}},sessionId);
  if (called.response.id !== 2 || called.response.error) throw new Error('MCP remote tool returned an error');
  return called.response.result;
}
const registerMCPServer=async(workspaceId,name,provider,version,tools,endpoint,authConfig)=>{
  const safeEndpoint=allowedEndpoint(endpoint);
  if (authConfig && Object.keys(authConfig).length) throw new Error('Inline MCP credentials are not supported; use a managed secret binding');
  const id=uuidv4();
  const [server]=await db('MCPServer').insert({id,workspace_id:workspaceId,name,provider,version,tools:JSON.stringify(tools||[]),endpoint:safeEndpoint,auth_config:'{}',status:'active',registered_at:new Date(),last_heartbeat:new Date()}).returning('*');
  return publicServer(server);
};
const getMCPServer=async serverId=>publicServer(await db('MCPServer').where({id:serverId}).first());
const unregisterMCPServer=async serverId=>db('MCPServer').where({id:serverId}).del();
const listMCPServers=async workspaceId=>(await db('MCPServer').where({workspace_id:workspaceId})).map(publicServer);
const discoverTools=async(workspaceId,pattern)=>{
  const servers=await listMCPServers(workspaceId);
  return servers.flatMap(s=>(typeof s.tools==='string'?JSON.parse(s.tools):s.tools || []).filter(t=>!pattern || t.name.includes(pattern)).map(t=>({...t,serverName:s.name,serverProvider:s.provider,serverId:s.id})));
};
const invokeMCPTool=async(workspaceId,userId,serverId,toolName,input)=>{
  const server=await db('MCPServer').where({id:serverId,workspace_id:workspaceId,status:'active'}).first();
  if (!server) throw new Error('MCP server not registered for this workspace');
  const tools=typeof server.tools==='string'?JSON.parse(server.tools):server.tools||[];
  if (!tools.some(t=>t.name===toolName)) throw new Error('Tool is not registered on MCP server');
  const access=await checkToolAccess(workspaceId,userId,toolName,'mcp',{input});
  if (!access.canExecute) throw new Error(`Tool denied by policy: ${access.reason}`);
  const result=await invokeStreamableHttp(allowedEndpoint(server.endpoint),toolName,input);
  return {success:!result.isError, result, toolName,serverId,workspaceId,executedAt:new Date().toISOString()};
};
const updateMCPServerHeartbeat=async serverId=>{
  const [row]=await db('MCPServer').where({id:serverId}).update({last_heartbeat:new Date()}).returning('*');
  return publicServer(row);
};
module.exports={registerMCPServer,unregisterMCPServer,getMCPServer,listMCPServers,discoverTools,invokeMCPTool,updateMCPServerHeartbeat,allowedEndpoint};
