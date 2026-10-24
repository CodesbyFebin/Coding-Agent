'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execute}=require('../runner');
test('real unprivileged Docker container validates JavaScript source',{skip:process.env.WORKER_DOCKER_TEST!=='1'},async()=>{
  const good=await execute({command:'node-check',files:{'main.js':'const value = 42;\n'}});
  assert.equal(good.status,'completed',JSON.stringify(good));
  const bad=await execute({command:'node-check',files:{'main.js':'const = ;\n'}});
  assert.equal(bad.status,'failed');
});
