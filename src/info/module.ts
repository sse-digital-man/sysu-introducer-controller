import { ModuleStatus } from "./status";

export interface ModuleInfo {
    kind: string;
    alias: string;
    name: string;
    status: ModuleStatus;
}
