import { test, after } from "node:test";
import assert from "node:assert/strict";
import pg from "pg";

if (process.env.LIVE_QUALIFICATION !== "disposable" || !process.env.DATABASE_URL) {
  test("staging database validation skipped without disposable flag",{skip:true},()=>{});
} else {
  const pool = new pg.Pool({connectionString:process.env.DATABASE_URL,max:2});
  after(async()=>pool.end());
  test("Better Auth tables and per-user workspace state migrate",async()=>{
    for(const table of ["user","session","account","coding_workspace_state"]) {
      const check=await pool.query("SELECT to_regclass($1) AS name",[table]);
      assert.ok(check.rows[0].name,table);
    }
  });
  test("stored snapshots stay partitioned by verified user identifier",async()=>{
    await pool.query(`INSERT INTO coding_workspace_state(user_id,snapshot,revision) VALUES ($1,$2::jsonb,1),($3,$4::jsonb,1)`,["user-A",JSON.stringify({sessions:[{title:"A"}]}),"user-B",JSON.stringify({sessions:[{title:"B"}]})]);
    const a=await pool.query("SELECT snapshot FROM coding_workspace_state WHERE user_id=$1",["user-A"]);
    const b=await pool.query("SELECT snapshot FROM coding_workspace_state WHERE user_id=$1",["user-B"]);
    assert.equal(a.rows[0].snapshot.sessions[0].title,"A");
    assert.equal(b.rows[0].snapshot.sessions[0].title,"B");
  });
}
