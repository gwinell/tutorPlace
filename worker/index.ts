import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import { runWithRuntimeEnvironment } from "../lib/runtime-env";
import { maintain } from "../lib/maintenance";
import type { ServerEnv } from "../lib/server";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";


const worker = {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    return runWithRuntimeEnvironment(env, () => runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx)));
  },
  async scheduled(_controller: ScheduledController, env: Cloudflare.Env) {
    try {
      await maintain(env as unknown as ServerEnv);
    } catch (error) {
      console.error("codeTogether scheduled maintenance failed:", error instanceof Error ? error.stack : error);
    }
  },
};

export default worker;
