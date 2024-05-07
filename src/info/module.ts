import { ModuleStatus } from "./status";

export interface ModuleInfo {
    name: string;
    alias: string;
    kind: string;
    kinds: string[];
    status: ModuleStatus;
    modules: string[];
}
