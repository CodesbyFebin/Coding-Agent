import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const allowedOrigins = new Set((Deno.env.get("APP_ORIGINS") || "https://app.codingagent.in").split(",").map(x=>x.trim()).filter(Boolean));

function cors(req: Request) {
  const origin=req.headers.get("origin") || "";
  const allow=allowedOrigins.has(origin)?origin:"https://app.codingagent.in";
  return {"Access-Control-Allow-Origin":allow,"Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Vary":"Origin"};
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
    if(req.method==="POST" && decision){const body=await req.json(); const {data,error}=await supabase.rpc("decide_approval_tx",{p_approval_id:decision[1],p_status:body.status}); if(error) throw error; return json(req,{approval:data});}

    return json(req,{error:"not found"},404);
  }catch(error){console.error(error);return json(req,{error:error instanceof Error?error.message:String(error)},500)}
});
