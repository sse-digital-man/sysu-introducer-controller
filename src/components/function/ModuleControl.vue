<template>
    <FunctionLayout title="模块控制" style="width: 100%">
        <!-- <div style="overflow-x: scroll; width: auto"> -->
        <el-scrollbar style="s">
            <el-space size="large">
                <ModuleControlCell
                    v-if="modules.length > 0"
                    v-for="module in modules"
                    :info="module"
                ></ModuleControlCell>
            </el-space>
        </el-scrollbar>
        <!-- </div> -->
    </FunctionLayout>
</template>

<script lang="ts">
import FunctionLayout from "../layout/FunctionLayout.vue";
import ModuleControlCell from "../ModuleControlCell.vue";

import { moduleControlApi } from "../../api";
import { ModuleInfo } from "../../info/module";

export default {
    components: {
        FunctionLayout,
        ModuleControlCell,
    },

    data() {
        return {
            modules: [] as ModuleInfo[],
        };
    },
    methods: {
        async initModuleList() {
            const response = await moduleControlApi.getControllableModuleList();
            this.modules = response.info.list;
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
</style>
