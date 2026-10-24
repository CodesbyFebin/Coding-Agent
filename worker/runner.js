'use strict';
const { Pool } = require('pg');
const { mkdtemp, writeFile, mkdir, rm, chmod } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const crypto = require('node:crypto');
const runFile = promisify(execFile);
const COMMANDS = Object.freeze({
  'node-check': ['node', '--check', '/work/main.js'],
  'python-compile': ['python', '-m', 'py_compile', '/work/main.py'],
});
function safeFilename(name) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._/-]{0,180}$/.test(name) || name.split('/').some(p=>p==='..'||p==='.') || name.startsWith('/')) throw new Error('Unsafe filename');
  return name;
}
async function execute(input) {
  const command=COMMANDS[input.command];
  if (!command) throw new Error('Unsupported worker command');
  if (!input.files || typeof input.files!=='object' || Object.keys(input.files).length>32) throw new Error('Invalid file manifest');
  const bytes=Buffer.byteLength(JSON.stringify(input.files));
  if (bytes>500000) throw new Error('Input exceeds 500 KB');
  const dir=await mkdtemp(path.join(tmpdir(),'codingagent-job-'));
  try {
    await chmod(dir,0o755);
    for (const [name,content] of Object.entries(input.files)) {
      if (typeof content!=='string') throw new Error('File content must be text');
      const full=path.join(dir,safeFilename(name));
      await mkdir(path.dirname(full),{recursive:true});
      await writeFile(full,content,{flag:'wx',mode:0o644});
    }
    const image=input.command==='node-check'?'node:22-alpine':'python:3.13-alpine';
    const args=['run','--rm','--network','none','--read-only','--cap-drop','ALL','--security-opt','no-new-privileges','--pids-limit','64','--memory','256m','--cpus','0.5','--user','65534:65534','--tmpfs','/tmp:rw,noexec,nosuid,size=16m','--env','PYTHONPYCACHEPREFIX=/tmp/pycache','--mount',`type=bind,source=${dir},target=/work,readonly`,image,...command];
    const started=Date.now();
    try {
      const result=await runFile('docker',args,{timeout:30000,maxBuffer:256000});
      return {status:'completed',exitCode:0,stdout:result.stdout.slice(0,100000),stderr:result.stderr.slice(0,100000),durationMs:Date.now()-started};
    } catch(err) {
      return {status:'failed',exitCode:typeof err.code==='number'?err.code:null,stdout:String(err.stdout||'').slice(0,100000),stderr:String(err.stderr||err.message).slice(0,100000),durationMs:Date.now()-started};
    }
  } finally { await rm(dir,{recursive:true,force:true}); }
}
async function once(pool) {
  const client=await pool.connect();
  let run;
  try {
    await client.query('BEGIN');
    await client.query(`UPDATE "AgentRun" SET status='queued',updated_at=NOW() WHERE status='running' AND started_at < NOW() - INTERVAL '5 minutes' AND input ? 'command'`);
    const claimed=await client.query(`SELECT * FROM "AgentRun" WHERE status='queued' AND input ? 'command' ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1`);
    run=claimed.rows[0];
    if(run) await client.query(`UPDATE "AgentRun" SET status='running',started_at=NOW(),updated_at=NOW() WHERE id=$1`,[run.id]);
    await client.query('COMMIT');
  } catch(e) {await client.query('ROLLBACK');throw e;} finally {client.release();}
  if(!run) return false;
  let output;
  try {output=await execute(run.input);} catch(e){output={status:'failed',error:String(e.message)};}
  const digest=crypto.createHash('sha256').update(JSON.stringify(output)).digest('hex');
  await pool.query(`UPDATE "AgentRun" SET status=$2,output=$3::jsonb,completed_at=NOW(),updated_at=NOW() WHERE id=$1 AND status='running'`,[run.id,output.status,JSON.stringify({...output,sha256:digest})]);
  return true;
}
async function main() {
  if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
  const pool=new Pool({connectionString:process.env.DATABASE_URL,max:2});
  try {
    while(true) {
      const found=await once(pool);
      if(!found) await new Promise(resolve=>setTimeout(resolve,2000));
    }
  } finally {await pool.end();}
}
if(require.main===module) main().catch(err=>{console.error(err);process.exitCode=1;});
module.exports={safeFilename,execute,once};
