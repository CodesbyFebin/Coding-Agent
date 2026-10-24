import { createFileRoute } from "@tanstack/react-router";
import { PersistedWorkbench } from "@/components/workbench/persisted-workbench";
import { SignInGate, RedirectToSignIn } from "@/lib/auth/gates";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <SignInGate fallback={<RedirectToSignIn />}><PersistedWorkbench /></SignInGate>;
}
