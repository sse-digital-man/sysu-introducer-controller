<template>
    <div>
        <FunctionLayout title="模块配置">
            <el-table
                :data="list"
                :header-cell-style="{ color: 'var(--el-color-black)', background: 'var(--el-bg-color-page)' }"
            >
                <el-table-column prop="name" label="名称">
                    <template #default="scope">
                        <span style="font-weight: bold; color: var(--el-color-primary)">
                            {{ toUpperAtFirst(scope.row.name) }}</span
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="alias" label="别名" min-width="120px"></el-table-column>
                <el-table-column prop="kind" label="实现类型"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template #default="scope">
                        {{ statusLabel.get(scope.row.status) }}
                    </template>
                </el-table-column>

                <!-- 操作栏 -->
                <el-table-column label="操作">
                    <template #default="scope">
                        <!-- <div style="display: flex; justify-content: center"> -->
                        <!-- 如果实现类型为空 则不能配置 -->
                        <el-button
                            :disabled="!checkCanChange(scope.row.status)"
                            type="info"
                            size="small"
                            @click="toConfigModule(scope.row)"
                            link
                        >
                            配置
                        </el-button>
                        <!-- </div> -->
                    </template>
                </el-table-column>
            </el-table>
        </FunctionLayout>

        <ModuleConfigDialog :info="selectModuleInfo" v-model="isVisible"></ModuleConfigDialog>
    </div>
</template>

<script lang="ts">
import { toUpperAtFirst } from "@/utils";

import FunctionLayout from "@/components/layout/FunctionLayout.vue";
import ModuleConfigDialog from "./ModuleConfigDialog.vue";

import { useModuleStore } from "@/store";
import { moduleControlApi } from "@/api";
import { ModuleInfo } from "@/info/module";
import { ModuleStatus, statusLabel } from "@/info/status";

export default {
    setup() {
        return {
            moduleStore: useModuleStore(),
        };
    },
    components: {
        FunctionLayout,
        ModuleConfigDialog,
    },
    data() {
        return {
            statusLabel,

            // 配置相关
            isVisible: false,
            selectModuleInfo: {} as ModuleInfo,
            toUpperAtFirst,
        };
    },
    methods: {
        async initList() {
            const resp = await moduleControlApi.getAllModuleList();
            this.list = resp.data.list;
        },
        checkCanChange(status: ModuleStatus) {
            return status == ModuleStatus.NotLoaded || status == ModuleStatus.Stopped;
        },
        toConfigModule(info: ModuleInfo) {
            this.isVisible = true;
            this.selectModuleInfo = info;
        },
    },
    computed: {
        list() {
            return this.moduleStore.moduleList;
        },
    },
};
</script>

<style>
.el-dialog {
    border-radius: 10px;
}
</style>
