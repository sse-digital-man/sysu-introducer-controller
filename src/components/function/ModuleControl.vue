<template>
    <FunctionLayout title="模块控制" style="width: 100%">
        <!-- <div style="overflow-x: scroll; width: auto"> -->
        <el-scrollbar v-if="modules.length > 0">
            <el-space size="large">
                <ModuleControlCell v-for="module in modules" :info="module"></ModuleControlCell>
            </el-space>
        </el-scrollbar>
        <div v-else id="empty-wrap">
            <el-icon style="font-size: 24px; margin-bottom: 5px"><InfoFilled /></el-icon>
            未加载模块
        </div>
        <!-- </div> -->
    </FunctionLayout>
</template>

<script lang="ts">
import { InfoFilled } from "@element-plus/icons-vue";

import FunctionLayout from "../layout/FunctionLayout.vue";
import ModuleControlCell from "../ModuleControlCell.vue";

import { moduleControlApi } from "../../api";
import { ModuleInfo } from "../../info/module";

export default {
    components: { InfoFilled, FunctionLayout, ModuleControlCell },

    data() {
        return {
            modules: [] as ModuleInfo[],
        };
    },
    methods: {
        async initModuleList() {
            const resp = await moduleControlApi.getControllableModuleList();
            this.modules = resp.data.list;
        },
    },
    async mounted() {
        await this.initModuleList();
    },
};
</script>

<style scoped>
#modules-wrap {
    display: flex;

    height: 100%;
    margin-bottom: 15px;
}
#empty-wrap {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    padding: 15px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    color: gray;
    border: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color-page);
}
</style>
