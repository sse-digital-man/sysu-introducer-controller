import { defineStore, createPinia } from "pinia";

import { ModuleInfo } from "../info/module";
import { ModuleStatus } from "../info/status";
import { HistoryMessage } from "@/info/message";

export const useModuleStore = defineStore("modules", {
    state: () => {
        return {
            modules: new Map<string, ModuleInfo>() as Map<string, ModuleInfo>,
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

const store = createPinia();

export default store;
