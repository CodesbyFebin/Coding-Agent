'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {safeFilename}=require('../runner');
test('worker rejects traversal and absolute paths',()=>{
  for(const name of ['../etc/passwd','/tmp/x','a/../../x','a\\b']) assert.throws(()=>safeFilename(name));
});
test('worker accepts bounded relative source paths',()=>{
  assert.equal(safeFilename('src/main.js'),'src/main.js');
});
