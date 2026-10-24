'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {allowedEndpoint}=require('../src/services/mcpService');
test('MCP destination fails closed without allowlist',()=>{
  const previous=process.env.MCP_ALLOWED_HOSTS;delete process.env.MCP_ALLOWED_HOSTS;
  assert.throws(()=>allowedEndpoint('https://example.org/mcp'),/allowed host/);
  if(previous===undefined) delete process.env.MCP_ALLOWED_HOSTS; else process.env.MCP_ALLOWED_HOSTS=previous;
});
test('MCP rejects private or insecure endpoints',()=>{
  const previous=process.env.MCP_ALLOWED_HOSTS;process.env.MCP_ALLOWED_HOSTS='mcp.example.org';
  assert.throws(()=>allowedEndpoint('http://mcp.example.org/mcp'));
  assert.throws(()=>allowedEndpoint('https://127.0.0.1/mcp'));
  assert.equal(allowedEndpoint('https://mcp.example.org/mcp'),'https://mcp.example.org/mcp');
  if(previous===undefined) delete process.env.MCP_ALLOWED_HOSTS; else process.env.MCP_ALLOWED_HOSTS=previous;
});
