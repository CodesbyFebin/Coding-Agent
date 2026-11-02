import { createServerFn } from "@tanstack/react-start";
import type { Workflow } from "./schema";
import type { WfResult } from "./engine";

/** Runs a workflow server-side: llm nodes use Nemotron on Nebius; check nodes run in the sandbox. */
export const runWorkflowFn = createServerFn({ method: "POST" })
  .validator((input: { workflow: Workflow; input: string; files: Record<string, string> }) => input)
  .handler(async ({ data }): Promise<WfResult> => {
    const { runWorkflow } = await import("./engine");
    const { nebiusChat } = await import("../agent/llm.server");
    const { NEMOTRON } = await import("../agent/nebius");
    const { scanSecurity } = await import("../meridian/security");
    const { checkCompliance } = await import("../meridian/compliance");
    const { execInSandbox } = await import("../agent/sandbox.server");
    const files = Object.fromEntries(Object.entries(data.files ?? {}).slice(0, 80));
    return runWorkflow(data.workflow, (data.input ?? "").slice(0, 6000), files, {
      llm: async (prompt, tier) => {
        const r = await nebiusChat({ model: NEMOTRON[tier], maxTokens: 1500, temperature: 0.2, messages: [{ role: "user", content: prompt }] });
        return { text: r.text, model: r.model, costUsd: r.costUsd };
      },
      tool: async (name, f, _node, vars) => {
        if (name === "security-scan") return JSON.stringify(scanSecurity(f));
        if (name === "compliance") return JSON.stringify(checkCompliance(f, scanSecurity(f)));
        return vars.input ?? "";
      },
      check: async (command, f) => {
        const r = await execInSandbox(f, command);
        return { exitCode: r.exitCode, output: (r.stdout + r.stderr).slice(-8000) };
      },
    });
  });
