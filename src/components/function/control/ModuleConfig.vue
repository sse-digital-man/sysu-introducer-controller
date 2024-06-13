<template>
    <div>
        <FunctionLayout title="运行配置">
            <el-tabs type="border-card" style="height: 100%" v-model="curTab" @tab-click="toChangeTab">
                <el-tab-pane label="模块配置" name="module">
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
                                {{ moduleStatusLabel.get(scope.row.status) }}
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
                </el-tab-pane>

                <el-tab-pane name="docker" v-loading="dockerTab.isLoading">
                    <template #label>
                        <el-icon>
                            <div v-html="dockerTab.icon" style="font-size: 24px; margin-right: 15px" />
                        </el-icon>
                        Docker
                    </template>

                    <el-table
                        :data="dockerTab.infoList"
                        :header-cell-style="{ color: 'var(--el-color-black)', background: 'var(--el-bg-color-page)' }"
                    >
                        <el-table-column prop="name" label="名称"> </el-table-column>
                        <el-table-column prop="image" label="镜像名称"></el-table-column>
                        <el-table-column prop="status" label="状态">
                            <template #default="scope">
                                <div style="display: flex; align-items: center">
                                    <div>{{ dockerTab.statusLabel.get(scope.row.status) }}</div>
                                    <el-icon
                                        style="font-size: 16px; margin-left: 5px"
                                        v-if="scope.row.status == DockerStatus.Handling"
                                        class="loading"
                                    >
                                        <Loading />
                                    </el-icon>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template #default="scope">
                                <!-- <div style="display: flex; justify-content: center"> -->
                                <!-- 如果实现类型为空 则不能配置 -->
                                <el-button
                                    type="primary"
                                    size="small"
                                    @click="toControlDocker(scope.row, 'start')"
                                    v-if="scope.row.status == DockerStatus.Exited"
                                    plain
                                >
                                    启动
                                </el-button>
                                <el-button
                                    type="danger"
                                    size="small"
                                    @click="toControlDocker(scope.row, 'stop')"
                                    v-else-if="scope.row.status == DockerStatus.Running"
                                    plain
                                >
                                    停止</el-button
                                >

                                <!-- </div> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </FunctionLayout>

        <ModuleConfigDialog :info="selectModuleInfo" v-model="isVisible"></ModuleConfigDialog>
    </div>
</template>

<script lang="ts">
import { toUpperAtFirst } from "@/utils";
import { Loading } from "@element-plus/icons-vue";

import FunctionLayout from "@/components/layout/FunctionLayout.vue";
import ModuleConfigDialog from "./ModuleConfigDialog.vue";
import Docker from "@/assets/icons/docker.svg?raw";

import { useModuleStore } from "@/store";
import { moduleControlApi } from "@/api";
import { ModuleInfo, ModuleStatus, moduleStatusLabel } from "@/info/module";
import { DockerInfo, DockerStatus, dockerStatusLabel } from "@/info/docker";
import { TabsPaneContext } from "element-plus";

export default {
    setup() {
        return {
            moduleStore: useModuleStore(),
        };
    },
    components: {
        Loading,
        FunctionLayout,
        ModuleConfigDialog,
    },
    data() {
        return {
            curTab: "module" as " module" | "docker",
            // 1. 模块 配置相关
            moduleStatusLabel,

            isVisible: false,
            selectModuleInfo: {} as ModuleInfo,
            toUpperAtFirst,

            // 2. Docker 配置相关
            dockerTab: {
                isLoading: false,
                infoList: [] as DockerInfo[],
                icon: Docker,
                statusLabel: dockerStatusLabel,
            },
            DockerStatus,
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
        // 控制 Docker 容器
        async toControlDocker(info: DockerInfo, cmd: "start" | "stop") {
            info.status = DockerStatus.Handling;
            const result = await moduleControlApi.controlModuleDockerContainer(info.moduleName, info.moduleKind, cmd);
            info.status = result.data.status;
        },
        async toChangeTab(pane: TabsPaneContext) {
            const name = pane.paneName;

            // 当切换到 Docker 页面时，需要调用 API 重新加载
            if (name == "docker") {
                this.dockerTab.isLoading = true;
                const result = await moduleControlApi.getModuleDockerInfoList();

                this.dockerTab.infoList = result.data.list;
                this.dockerTab.isLoading = false;
            }
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
