import { neon } from 'npm:@neondatabase/serverless@0.24';
import { decode as b64decode } from 'jsr:@oslojs/encoding@1';

const NEON_URL = Deno.env.get('NEON_URL')!;
const allowedOrigins = new Set((Deno.env.get('APP_ORIGINS') || 'https://app.codingagent.in').split(',').map(x=>x.trim()).filter(Boolean));

function cors(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allow = allowedOrigins.has(origin) ? origin : "https://app.codingagent.in";
  return {"Access-Control-Allow-Origin": allow, "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS", "Vary": "Origin"};
}
function json(req: Request, data: unknown, status=200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {...cors(req), "Content-Type": "application/json", "Cache-Control": "no-store"}
  });
}
function db() {
  const sql = neon(NEON_URL);
  return { sql };
}
function parseToken(req: Request): { userId: string | null } {
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return { userId: null };
  const token = auth.slice(7);
  try {
    const payload = JSON.parse(b64decode(token.split('.')[1], 'base64'));
    return { userId: payload.sub || payload.userId || null };
  } catch {
    return { userId: null };
  }
}

const NEON_EDGE = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const p = url.pathname.replace(/^\/mission-api/, "") || "/";

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });

  const { userId } = parseToken(req);
  if (!userId) return json(req, { error: "unauthorized" }, 401);

  try {
    const { sql } = db();

    if (req.method === "GET" && p === "/health") {
      return json(req, { status: "LIVE", service: "codingagent-mission-api", userId });
    }

    if (req.method === "GET" && p === "/bootstrap") {
      const [projects, members, missions, approvals, events, memory, skills, schedules] = await Promise.all([
        sql`SELECT id, name, owner_id, created_at, updated_at FROM projects ORDER BY created_at DESC`,
        sql`SELECT project_id, role FROM project_members WHERE user_id = ${userId}`,
        sql`SELECT id, project_id, goal, mode, classification, status, progress, created_at, updated_at FROM missions ORDER BY created_at DESC LIMIT 100`,
        sql`SELECT id, mission_id, task_id, action, reason, risk, status, requested_at, decided_at, decided_by FROM approvals ORDER BY requested_at DESC LIMIT 100`,
        sql`SELECT id, mission_id, sequence, type, payload, created_at FROM mission_events ORDER BY created_at DESC LIMIT 100`,
        sql`SELECT id, project_id, scope, key, review_status, created_at, updated_at FROM memory_entries ORDER BY updated_at DESC LIMIT 100`,
        sql`SELECT id, project_id, name, version, status, created_at, updated_at FROM skills ORDER BY updated_at DESC LIMIT 100`,
        sql`SELECT id, project_id, name, kind, expression, enabled, created_at, updated_at FROM schedules ORDER BY created_at DESC LIMIT 100`
      ]);
      const roles = new Map(members.map((x: any) => [x.project_id, x.role]));
      return json(req, {
        user: { id: userId },
        projects: (projects || []).map((x: any) => ({ ...x, role: roles.get(x.id) || "MEMBER" })),
        missions: missions || [],
        approvals: approvals || [],
        events: events || [],
        memory: memory || [],
        skills: skills || [],
        schedules: schedules || [],
        runtime: { database: "LIVE", modelProvider: "UNAVAILABLE", toolGateway: "UNAVAILABLE", mcp: "UNAVAILABLE", sandbox: "UNAVAILABLE" }
      });
    }

    if (req.method === "POST" && p === "/projects") {
      const body = await req.json();
      const name = String(body.name || "").trim();
      if (!name) return json(req, { error: "name required" }, 400);
      const result = await sql`INSERT INTO projects (owner_id, name) VALUES (${userId}, ${name}) RETURNING *`;
      return json(req, { project: result[0] }, 201);
    }

    if (req.method === "POST" && p === "/missions") {
      const body = await req.json();
      const result = await sql`SELECT * FROM create_mission_tx(${body.projectId}, ${String(body.goal || "")}, ${body.mode || "AUTO"}, ${body.classification || "INTERNAL"})`;
      return json(req, { mission: result[0] }, 201);
    }

    const decision = p.match(/^\/approvals\/([0-9a-f-]+)\/decision$/i);
    if (req.method === "POST" && decision) {
      const body = await req.json();
      const result = await sql`SELECT * FROM decide_approval_tx(${decision[1]}, ${body.status})`;
      return json(req, { approval: result[0] });
    }

    if (req.method === "GET" && p === "/models") {
      const data = await sql`SELECT id, name, provider, routing_policy, health_status, created_at FROM models ORDER BY created_at DESC LIMIT 100`;
      return json(req, { models: data || [] });
    }
    if (req.method === "GET" && p === "/agents") {
      const data = await sql`SELECT id, name, model_id, workspace, permissions, status, created_at FROM agents ORDER BY created_at DESC LIMIT 100`;
      return json(req, { agents: data || [] });
    }
    if (req.method === "GET" && p === "/tools") {
      const data = await sql`SELECT id, tool_name, tool_type, execution_result, created_at FROM tool_invocations ORDER BY created_at DESC LIMIT 100`;
      return json(req, { tools: data || [] });
    }
    if (req.method === "GET" && p === "/swarms") {
      const data = await sql`SELECT id, name, parent_agent_id, workspace, status, created_at FROM agents ORDER BY created_at DESC LIMIT 100`;
      return json(req, { swarms: data || [] });
    }
    if (req.method === "GET" && p === "/mcp-servers") {
      const data = await sql`SELECT id, name, transport_type, health_status, tool_inventory, created_at FROM mcp_servers ORDER BY created_at DESC LIMIT 100`;
      return json(req, { mcpServers: data || [] });
    }
    if (req.method === "GET" && p === "/memory") {
      const data = await sql`SELECT id, project_id, scope, key, review_status, created_at, updated_at FROM memory_entries ORDER BY created_at DESC LIMIT 100`;
      return json(req, { memory: data || [] });
    }
    if (req.method === "GET" && p === "/skills") {
      const data = await sql`SELECT id, project_id, name, version, status, created_at FROM skills ORDER BY created_at DESC LIMIT 100`;
      return json(req, { skills: data || [] });
    }
    if (req.method === "GET" && p === "/verification") {
      const data = await sql`SELECT id, mission_id, task_id, verifier_type, status, verified_at, created_at FROM verification_runs ORDER BY created_at DESC LIMIT 100`;
      return json(req, { verification: data || [] });
    }
    if (req.method === "GET" && p === "/security") {
      const data = await sql`SELECT id, name, resource_type, action, effect, created_at FROM policy_rules ORDER BY created_at DESC LIMIT 100`;
      return json(req, { security: data || [] });
    }
    if (req.method === "GET" && p === "/runtime") {
      const data = await sql`SELECT id, name, status, workspace, created_at FROM agents ORDER BY created_at DESC LIMIT 100`;
      return json(req, { runtime: data || [] });
    }
    if (req.method === "GET" && p === "/orchestration") {
      const data = await sql`SELECT id, name, parent_agent_id, workspace, status, created_at FROM agents ORDER BY created_at DESC LIMIT 100`;
      return json(req, { orchestration: data || [] });
    }
    if (req.method === "GET" && p === "/gateway") {
      const data = await sql`SELECT id, tool_name, policy_rule_id, approval_id, created_at FROM tool_invocations ORDER BY created_at DESC LIMIT 100`;
      return json(req, { gateway: data || [] });
    }
    if (req.method === "GET" && p === "/router") {
      const data = await sql`SELECT id, model_id, provider, capability_decision, created_at FROM model_invocations ORDER BY created_at DESC LIMIT 100`;
      return json(req, { router: data || [] });
    }
    if (req.method === "GET" && p === "/habitat") {
      const data = await sql`SELECT id, name, workspace, created_at FROM agents ORDER BY created_at DESC LIMIT 100`;
      return json(req, { habitat: data || [] });
    }
    if (req.method === "GET" && p === "/events") {
      const data = await sql`SELECT id, mission_id, sequence, type, payload, created_at FROM mission_events ORDER BY created_at DESC LIMIT 100`;
      return json(req, { events: data || [] });
    }
    if (req.method === "GET" && p === "/evidence") {
      const data = await sql`SELECT id, mission_id, task_id, agent_id, claim, source_type, collected_at FROM evidence ORDER BY collected_at DESC LIMIT 100`;
      return json(req, { evidence: data || [] });
    }
    if (req.method === "GET" && p === "/artifacts") {
      const data = await sql`SELECT id, project_id, mission_id, task_id, name, kind, created_at FROM artifacts ORDER BY created_at DESC LIMIT 100`;
      return json(req, { artifacts: data || [] });
    }
    if (req.method === "GET" && p === "/schedules") {
      const data = await sql`SELECT id, project_id, name, kind, expression, enabled, created_at FROM schedules ORDER BY created_at DESC LIMIT 100`;
      return json(req, { schedules: data || [] });
    }
    if (req.method === "GET" && p === "/usage") {
      const data = await sql`SELECT id, project_id, operation_type, tokens_used, cost, timestamp FROM usage_records ORDER BY timestamp DESC LIMIT 100`;
      return json(req, { usage: data || [] });
    }
    if (req.method === "GET" && p === "/audit") {
      const data = await sql`SELECT id, project_id, user_id, action, resource_type, success, timestamp FROM audit_logs ORDER BY timestamp DESC LIMIT 100`;
      return json(req, { audit: data || [] });
    }
    if (req.method === "GET" && p === "/webhooks") {
      const data = await sql`SELECT id, project_id, name, url, events, active, created_at FROM webhooks ORDER BY created_at DESC LIMIT 100`;
      return json(req, { webhooks: data || [] });
    }

    return json(req, { error: "not found" }, 404);
  } catch (error) {
    console.error(error);
    return json(req, { error: error instanceof Error ? error.message : String(error) }, 500);
  }
};

export default NEON_EDGE;
