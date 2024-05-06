<template>
    <FunctionLayout title="模块控制" style="width: 100%">
        <!-- <div style="overflow-x: scroll; width: auto"> -->
        <el-scrollbar style="s">
            <el-space size="large">
                <ModuleControlCell v-for="module in modules" :title="module"></ModuleControlCell>
            </el-space>
        </el-scrollbar>
        <!-- </div> -->
    </FunctionLayout>
</template>

<script lang="ts">
import FunctionLayout from "../layout/FunctionLayout.vue";
import ModuleControlCell from "../ModuleControlCell.vue";

export default {
    components: {
        FunctionLayout,
        ModuleControlCell,
    },

    data() {
        return {
            modules: ["处理核心", "网络爬虫", "人物渲染器"],
        };
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
