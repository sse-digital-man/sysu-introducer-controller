<template>
    <FunctionLayout title="模块控制" style="width: 100%">
        <!-- <div style="overflow-x: scroll; width: auto"> -->
        <el-scrollbar v-if="modules.length > 0">
            <el-space size="large">
                <ModuleControlCell v-for="module in modules" :info="module"></ModuleControlCell>
            </el-space>
        </el-scrollbar>
        <EmptyPlaceholder text="未加载模块" style="height: 100%" v-else></EmptyPlaceholder>
        <!-- </div> -->
    </FunctionLayout>
</template>

<script lang="ts">
import FunctionLayout from "@/components/layout/FunctionLayout.vue";
import ModuleControlCell from "@/components/ModuleControlCell.vue";
import EmptyPlaceholder from "@/components/EmptyPlaceholder.vue";

import { useModuleStore } from "@/store";

export default {
    setup() {
        return {
            moduleStore: useModuleStore(),
        };
    },
    components: { FunctionLayout, ModuleControlCell, EmptyPlaceholder },
    computed: {
        modules() {
            return this.moduleStore.controllableModuleList;
        },
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
