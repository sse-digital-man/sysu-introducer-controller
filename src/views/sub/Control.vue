<template>
    <div class="col-wrap">
        <div class="row-wrap" style="height: auto">
            <!-- Notice: 需要给两块地方单独设置一下占比 以解决宽度溢出的问题 -->
            <RunStatus style="width: 30%"></RunStatus>
            <ModuleControl style="width: 70%; margin-left: 20px"></ModuleControl>
        </div>
        <div class="row-wrap" style="height: 70%">
            <ModuleConfig style="width: 50%"></ModuleConfig>
            <LogDisplay style="width: 50%; margin-left: 20px"></LogDisplay>
        </div>
    </div>
</template>

<script lang="ts">
import RunStatus from "@/components/function/config/RunStatus.vue";
import ModuleControl from "@/components/function/config/ModuleControl.vue";
import ModuleConfig from "@/components/function/config/ModuleConfig.vue";
import LogDisplay from "@/components/function/config/LogDisplay.vue";

import { moduleControlApi } from "../../api";
import { useModuleStore } from "../../store";

import { ModuleLogKind } from "../../info/log";

export default {
    setup() {
        return {
            moduleStore: useModuleStore(),
        };
    },
    components: {
        RunStatus,
        ModuleControl,
        ModuleConfig,
        LogDisplay,
    },
    async created() {
        // 初始化全局模块信息表
        const modules = await moduleControlApi.getAllModuleList();
        this.moduleStore.initModule(modules.data.list);

        window.ws.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            if (data.kind == ModuleLogKind.ModuleStatus) {
                this.moduleStore.updateModuleStatus(data.name, data.status);
            }
        });
    },
};
</script>

<style scoped>
.col-wrap {
    display: flex;
    flex-direction: column;

    height: 100%;
}
.row-wrap {
    display: flex;
    justify-content: space-between;
    margin: 10px;
}
</style>
