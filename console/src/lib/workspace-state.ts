import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

const snapshotSchema = z.object({
  sessions: z.array(z.unknown()).max(24),
  currentId: z.string().max(200),
  cronJobs: z.array(z.unknown()).max(20),
}).strict();
export const loadWorkspaceState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<{snapshot:unknown;revision:number}>(
      "SELECT snapshot, revision FROM coding_workspace_state WHERE user_id = $1",
      [context.userId],
    );
    return { snapshotJson: rows[0] ? JSON.stringify(rows[0].snapshot) : null, revision: Number(rows[0]?.revision ?? 0) };
  });
export const saveWorkspaceState = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data:unknown) => {
    const parsed = z.object({snapshot:snapshotSchema,expectedRevision:z.number().int().min(0)}).parse(data);
    if (JSON.stringify(parsed.snapshot).length > 2_000_000) throw new Error("Workspace exceeds 2 MB limit");
    return parsed;
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<{revision:number}>(
      `INSERT INTO coding_workspace_state (user_id, snapshot, revision)
       SELECT $1, $2::jsonb, 1 WHERE $3::bigint = 0
       ON CONFLICT (user_id) DO UPDATE
       SET snapshot = EXCLUDED.snapshot, revision = coding_workspace_state.revision + 1, updated_at = NOW()
       WHERE coding_workspace_state.revision = $3::bigint
       RETURNING revision`,
      [context.userId, JSON.stringify(data.snapshot), data.expectedRevision],
    );
    if (!rows.length) return {ok:false,conflict:true,revision:data.expectedRevision};
    return {ok:true,conflict:false,revision:Number(rows[0].revision)};
  });
