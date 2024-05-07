import { defineStore, createPinia } from "pinia";

import { ModuleInfo } from "../info/module";
import { ModuleStatus } from "../info/status";

export const useModuleStore = defineStore("modules", {
    state: () => {
        return {
            modules: new Map<string, ModuleInfo>(),
        };
    },
    actions: {
        initModule(modules: ModuleInfo[]) {
            const moduleMap = new Map<string, ModuleInfo>();
            for (let module of modules) {
                moduleMap.set(module.name, module);
            }
            this.modules = moduleMap;

            console.log(moduleMap);
        },
        updateModuleStatus(name: string, status: ModuleStatus) {
            const info = this.modules.get(name);
            if (info == undefined) return;
            info.status = status;
        },
    },
});

const store = createPinia();

export default store;
