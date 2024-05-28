import { defineStore, createPinia } from "pinia";

import { ModuleInfo, ModuleStatus, ModuleConfigItem, ModuleLogKind, HistoryMessage } from "@/info";

export const useModuleStore = defineStore("modules", {
    state: () => {
        return {
            modules: new Map<string, ModuleInfo>() as Map<string, ModuleInfo>,
            config: new Map() as Map<string, Map<string, Map<string, ModuleConfigItem>>>,
        };
    },
    getters: {
        controllableModuleList() {
            const list = [] as ModuleInfo[];

            const booterInfo = this.modules.get("booter");
            if (booterInfo == undefined) return list;

            for (let module of booterInfo.modules) {
                const subInfo = this.modules.get(module);
                if (subInfo != undefined) list.push(subInfo);
            }

            return list;
        },
        moduleList(): ModuleInfo[] {
            return Array.from(this.modules.values());
        },

        getModuleInstantConfig() {
            return (name: string, kind: string) => {
                const moduleConfig = this.config.get(name) as Map<string, Map<string, ModuleConfigItem>>;
                if (moduleConfig == undefined) return undefined;

                return moduleConfig.get(kind);
            };
        },
    },
    actions: {
        initModule(modules: ModuleInfo[]) {
            const moduleMap = new Map<string, ModuleInfo>();
            for (let module of modules) {
                moduleMap.set(module.name, module);
            }
            this.modules = moduleMap;
        },
        initUserConfig(config: any) {
            for (let [name, module] of Object.entries(config)) {
                const moduleConfigMap = new Map<string, Map<string, ModuleConfigItem>>();

                for (let [kind, instant] of Object.entries(module as any)) {
                    const instantConfigMap = new Map<string, ModuleConfigItem>();

                    for (let [field, content] of Object.entries(instant as any)) {
                        instantConfigMap.set(field, content as ModuleConfigItem);
                    }
                    moduleConfigMap.set(kind, instantConfigMap);
                }
                this.config.set(name, moduleConfigMap);
            }
        },
        updateModuleStatus(name: string, status: ModuleStatus) {
            const info = this.modules.get(name);
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
