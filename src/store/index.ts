import { defineStore, createPinia } from "pinia";

import { ModuleInfo, ModuleTreeNode, ModuleStatus, toInfo } from "@/info/module";
import { ModuleConfigItem } from "@/info/config";
import { ModuleLogKind } from "@/info/log";
import { HistoryMessage } from "@/info/message";

const toInstanceLabel = (name: string, kind: string) => {
    return `${name}_${kind}`;
};

export const useModuleStore = defineStore("modules", {
    state: () => {
        return {
            modulesTree: undefined as ModuleTreeNode | undefined,
            modulesList: new Map<string, ModuleInfo>(),
            config: new Map() as Map<string, Map<string, Map<string, ModuleConfigItem>>>,
        };
    },
    getters: {
        moduleList(): ModuleInfo[] {
            return Array.from(this.modulesList.values());
        },
        moduleMap(): Map<string, ModuleInfo> {
            return this.modulesList;
        },
        moduleTree(): ModuleTreeNode | undefined {
            return this.modulesTree;
        },
        rootModule(): ModuleInfo | undefined {
            if (this.modulesTree == undefined) {
                return undefined;
            }

            return toInfo(this.modulesTree);
        },
        controllableModuleList(): ModuleInfo[] {
            const submodules = this.modulesTree != undefined ? this.modulesTree.modules : undefined;
            if (submodules == undefined) {
                return [];
            }
            return submodules.map((subModule) => toInfo(subModule));
        },
        // getModuleInstantConfig() {
        //     return (name: string, kind: string) => {
        //         const moduleConfig = this.config.get(name) as Map<string, Map<string, ModuleConfigItem>>;
        //         if (moduleConfig == undefined) return undefined;

        //         return moduleConfig.get(kind);
        //     };
        // },
    },
    actions: {
        initModule(modules: ModuleInfo[], modulesTree: any) {
            const moduleMap = new Map<string, ModuleInfo>();
            for (let module of modules) {
                moduleMap.set(toInstanceLabel(module.name, module.kind), module);
            }
            this.modulesList = moduleMap;
            this.modulesTree = modulesTree;
        },
        initUserConfig(config: any) {
            for (let [name, module] of Object.entries(config)) {
                const moduleConfigMap = new Map<string, Map<string, ModuleConfigItem>>();

                for (let [kind, instance] of Object.entries(module as any)) {
                    const instantConfigMap = new Map<string, ModuleConfigItem>();

                    for (let [field, content] of Object.entries(instance as any)) {
                        instantConfigMap.set(field, content as ModuleConfigItem);
                    }
                    moduleConfigMap.set(kind, instantConfigMap);
                }
                this.config.set(name, moduleConfigMap);
            }
        },
        updateModuleStatus(name: string, status: ModuleStatus) {
            const info = this.moduleMap.get(name);
            if (info == undefined) return;
            info.status = status;
        },
    },
});

export const useMessageStore = defineStore("messages", {
    state: () => {
        return {
            historyMessages: [
                {
                    role: "user",
                    content: "介绍一下自己",
                },
                {
                    role: "assistant",
                    content: "你好，我是中大介绍官中小大",
                },
            ] as HistoryMessage[],
        };
    },
    actions: {
        appendHistoryMessage(role: "user" | "assistant", content: string) {
            console.log(role, content);
            this.historyMessages.push({ role, content });
        },
    },
});

export const useLogStore = defineStore("log", {
    state: () => {
        return {
            log: [] as { time: string; logKind: ModuleLogKind; content: string }[],
        };
    },
    actions: {
        appendLog(time: string, logKind: ModuleLogKind, content: string) {
            this.log.push({
                time,
                content,
                logKind,
            });
        },
    },
});

const store = createPinia();

export default store;
