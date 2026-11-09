import { AsyncLocalStorage } from "node:async_hooks";

export type RuntimeEnvironment = Record<string, unknown>;

const requestEnvironment = new AsyncLocalStorage<object>();

export function runWithRuntimeEnvironment<T>(environment: object, run: () => T): T {
  return requestEnvironment.run(environment, run);
}

export function getRuntimeEnvironment(): RuntimeEnvironment {
  return (requestEnvironment.getStore() as RuntimeEnvironment | undefined) ?? process.env;
}
