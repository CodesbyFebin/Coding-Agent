'use strict';
const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const db = require('../src/config/db');
const app = require('../src/server');
if (!process.env.DATABASE_URL || process.env.LIVE_QUALIFICATION !== 'disposable') {
  test('PostgreSQL integration skipped outside disposable CI', {skip:true},()=>{});
} else {
  const migrationDir = path.resolve(__dirname,'../../neon/migrations');
  const files=fs.readdirSync(migrationDir).filter(x=>/^00[1-6]_.*\.sql$/.test(x)).sort();
  let server;
  let base;
  after(async()=>{if(server) await new Promise(r=>server.close(r));await db.destroy();});
  test('apply all six migrations to disposable PostgreSQL',async()=>{
    // Supabase-style migrations reference roles absent from vanilla Postgres.
    for (const role of ['anon','authenticated','service_role']) {
      await db.raw(`DO $ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${role}') THEN CREATE ROLE ${role} NOLOGIN; END IF; END $;`);
    }
    for(const file of files) await db.raw(fs.readFileSync(path.join(migrationDir,file),'utf8'));
    assert.equal(files.length,6);
    const rows=await db('directory_agents').count('* as count');assert.equal(Number(rows[0].count),0);
    server=app.listen(0);
    await new Promise(resolve=>server.once('listening',resolve));
    base=`http://127.0.0.1:${server.address().port}/api/v1`;
  });
  const request=async(url,method='GET',data,token)=>{
    const r=await fetch(base+url,{method,headers:{'content-type':'application/json',...(token?{authorization:`Bearer ${token}`}:{})},body:data?JSON.stringify(data):undefined});
    return {status:r.status,body:r.status===204?null:await r.json()};
  };
  test('two users cannot read each others workspaces',async()=>{
    const one=await request('/auth/signup','POST',{email:'one@example.test',password:'Long-Test-Password-1'});
    const two=await request('/auth/signup','POST',{email:'two@example.test',password:'Long-Test-Password-2'});
    assert.equal(one.status,201);assert.equal(two.status,201);
    const workspace=await request('/workspaces','POST',{name:'Tenant One'},one.body.token);
    assert.equal(workspace.status,201);
    const denied=await request(`/workspaces/${workspace.body.id}`,'GET',undefined,two.body.token);
    assert.equal(denied.status,403);
    const directoryWrite=await request('/directory/agents','POST',{slug:'test-agent',name:'Test Agent',category:'agent'},two.body.token);
    assert.equal(directoryWrite.status,403);
    const evidenceWrite=await request('/verifications','POST',{workspaceId:workspace.body.id},two.body.token);
    assert.equal(evidenceWrite.status,403);
    const owner=await request(`/workspaces/${workspace.body.id}`,'GET',undefined,one.body.token);
    assert.equal(owner.status,200);
  });
}
