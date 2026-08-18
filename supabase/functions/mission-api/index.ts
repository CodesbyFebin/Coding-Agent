import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const allowedOrigins = new Set((Deno.env.get("APP_ORIGINS") || "https://app.codingagent.in").split(",").map(x=>x.trim()).filter(Boolean));

function cors(req: Request) {
  const origin=req.headers.get("origin") || "";
  const allow=allowedOrigins.has(origin)?origin:"https://app.codingagent.in";
  return {"Access-Control-Allow-Origin":allow,"Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"GET,POST,PUT,PATCH,DELETE,OPTIONS","Vary":"Origin"};
}
function json(req: Request, data: unknown, status=200){return new Response(JSON.stringify(data),{status,headers:{...cors(req),"Content-Type":"application/json","Cache-Control":"no-store"}})}
function client(req: Request){const auth=req.headers.get("Authorization") || "";return createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{global:{headers:{Authorization:auth}},auth:{persistSession:false}})}

Deno.serve(async (req: Request) => {
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors(req)});
  try{
    const supabase=client(req);
    const {data:{user},error:userError}=await supabase.auth.getUser();
    if(userError||!user) return json(req,{error:"unauthorized"},401);
    const url=new URL(req.url); const p=url.pathname.replace(/^\/mission-api/,"") || "/";

    if(req.method==="GET" && p==="/health") return json(req,{status:"LIVE",service:"codingagent-mission-api",userId:user.id});

    if(req.method==="GET" && p==="/bootstrap"){
      const [projects,members,missions,approvals,events,memory,skills,schedules]=await Promise.all([
        supabase.from("projects").select("id,name,owner_id,created_at,updated_at").order("created_at",{ascending:false}),
        supabase.from("project_members").select("project_id,role").eq("user_id",user.id),
        supabase.from("missions").select("id,project_id,goal,mode,classification,status,progress,created_at,updated_at").order("created_at",{ascending:false}).limit(100),
        supabase.from("approvals").select("id,mission_id,task_id,action,reason,risk,status,requested_at,decided_at,decided_by").order("requested_at",{ascending:false}).limit(100),
        supabase.from("mission_events").select("id,mission_id,sequence,type,payload,created_at").order("created_at",{ascending:false}).limit(100),
        supabase.from("memory_entries").select("id,project_id,scope,key,review_status,created_at,updated_at").order("updated_at",{ascending:false}).limit(100),
        supabase.from("skills").select("id,project_id,name,version,status,created_at,updated_at").order("updated_at",{ascending:false}).limit(100),
        supabase.from("schedules").select("id,project_id,name,kind,expression,enabled,created_at,updated_at").order("created_at",{ascending:false}).limit(100)
      ]);
      const errors=[projects,members,missions,approvals,events,memory,skills,schedules].map(x=>x.error).filter(Boolean); if(errors.length) throw errors[0];
      const roles=new Map((members.data||[]).map((x:any)=>[x.project_id,x.role]));
      return json(req,{user:{id:user.id,email:user.email},projects:(projects.data||[]).map((x:any)=>({...x,role:roles.get(x.id)||"MEMBER"})),missions:missions.data||[],approvals:approvals.data||[],events:events.data||[],memory:memory.data||[],skills:skills.data||[],schedules:schedules.data||[],runtime:{database:"LIVE",modelProvider:"UNAVAILABLE",toolGateway:"UNAVAILABLE",mcp:"UNAVAILABLE",sandbox:"UNAVAILABLE"}});
    }

    if(req.method==="POST" && p==="/projects"){
      const body=await req.json(); const name=String(body.name||"").trim(); if(!name) return json(req,{error:"name required"},400);
      const {data,error}=await supabase.from("projects").insert({owner_id:user.id,name}).select().single(); if(error) throw error; return json(req,{project:data},201);
    }

    if(req.method==="POST" && p==="/missions"){
      const body=await req.json();
      const {data,error}=await supabase.rpc("create_mission_tx",{p_project_id:body.projectId,p_goal:String(body.goal||""),p_mode:body.mode||"AUTO",p_classification:body.classification||"INTERNAL"});
      if(error) throw error; return json(req,{mission:data},201);
    }

    const decision=p.match(/^\/approvals\/([0-9a-f-]+)\/decision$/i);
    if(req.method=="POST" && decision){const body=await req.json(); const {data,error}=await supabase.rpc("decide_approval_tx",{p_approval_id:decision[1],p_status:body.status}); if(error) throw error; return json(req,{approval:data});}

    if(req.method==="GET" && p==="/models"){
      const {data,error}=await supabase.from("models").select("id,name,provider,routing_policy,health_status,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{models:data||[]});
    }

    if(req.method=="GET" && p==="/agents"){
      const {data,error}=await supabase.from("agents").select("id,name,model_id,workspace,permissions,status,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{agents:data||[]});
    }

    if(req.method=="GET" && p==="/tools"){
      const {data,error}=await supabase.from("tool_invocations").select("id,tool_name,tool_type,execution_result,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{tools:data||[]});
    }

    if(req.method=="GET" && p==="/swarms"){
      const {data,error}=await supabase.from("agents").select("id,name,parent_agent_id,workspace,status").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{swarms:data||[]});
    }

    if(req.method=="GET" && p==="/mcp-servers"){
      const {data,error}=await supabase.from("mcp_servers").select("id,name,transport_type,health_status,tool_inventory,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{mcpServers:data||[]});
    }

    if(req.method=="GET" && p==="/memory"){
      const {data,error}=await supabase.from("memory_entries").select("id,project_id,scope,key,review_status,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{memory:data||[]});
    }

    if(req.method=="GET" && p==="/skills"){
      const {data,error}=await supabase.from("skills").select("id,project_id,name,version,status,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{skills:data||[]});
    }

    if(req.method=="GET" && p==="/verification"){
      const {data,error}=await supabase.from("verification_runs").select("id,mission_id,task_id,verifier_type,status,verified_at,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{verification:data||[]});
    }

    if(req.method=="GET" && p==="/security"){
      const {data,error}=await supabase.from("policy_rules").select("id,name,resource_type,action,effect,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{security:data||[]});
    }

    if(req.method=="GET" && p==="/runtime"){
      const {data,error}=await supabase.from("agents").select("id,name,status,workspace,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{runtime:data||[]});
    }

    if(req.method=="GET" && p==="/orchestration"){
      const {data,error}=await supabase.from("agents").select("id,name,parent_agent_id,workspace,status").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{orchestration:data||[]});
    }

    if(req.method=="GET" && p==="/gateway"){
      const {data,error}=await supabase.from("tool_invocations").select("id,tool_name,policy_rule_id,approval_id,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{gateway:data||[]});
    }

    if(req.method=="GET" && p==="/router"){
      const {data,error}=await supabase.from("model_invocations").select("id,model_id,provider,capability_decision,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{router:data||[]});
    }

    if(req.method=="GET" && p==="/habitat"){
      const {data,error}=await supabase.from("agents").select("id,name,workspace,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{habitat:data||[]});
    }

    if(req.method=="GET" && p==="/events"){
      const {data,error}=await supabase.from("mission_events").select("id,mission_id,sequence,type,payload,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{events:data||[]});
    }

    if(req.method=="GET" && p==="/evidence"){
      const {data,error}=await supabase.from("evidence").select("id,mission_id,task_id,agent_id,claim,source_type,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{evidence:data||[]});
    }

    if(req.method=="GET" && p==="/artifacts"){
      const {data,error}=await supabase.from("artifacts").select("id,project_id,mission_id,task_id,name,kind,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{artifacts:data||[]});
    }

    if(req.method=="GET" && p==="/schedules"){
      const {data,error}=await supabase.from("schedules").select("id,project_id,name,kind,expression,enabled,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{schedules:data||[]});
    }

    if(req.method=="GET" && p==="/usage"){
      const {data,error}=await supabase.from("usage_records").select("id,project_id,operation_type,tokens_used,cost,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{usage:data||[]});
    }

    if(req.method=="GET" && p==="/audit"){
      const {data,error}=await supabase.from("audit_logs").select("id,project_id,user_id,action,resource_type,success,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{audit:data||[]});
    }

    if(req.method=="GET" && p==="/webhooks"){
      const {data,error}=await supabase.from("webhooks").select("id,project_id,name,url,events,active,created_at").order("created_at",{ascending:false}).limit(100);
      if(error) throw error; return json(req,{webhooks:data||[]});
    }

    return json(req,{error:"not found"},404);
  }catch(error){console.error(error);return json(req,{error:error instanceof Error?error.message:String(error)},500)}
});
