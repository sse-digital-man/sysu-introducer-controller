<template>
    <div>
        <FunctionLayout title="模块信息">
            <el-tabs type="border-card" style="height: 100%" v-model="curTab" @tab-click="toChangeTab">
                <el-tab-pane label="实例列表" name="module">
                    <el-table
                        :data="list"
                        :header-cell-style="{
                            color: 'var(--el-color-black)',
                            background: 'var(--el-bg-color-page)',
                        }"
                        :height="tabHeight"
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

                        <!-- <el-table-column label="操作">
                            <template #default="scope">
                                <el-button
                                    :disabled="!checkCanChange(scope.row.status)"
                                    type="info"
                                    size="small"
                                    @click="toConfigModule(scope.row)"
                                    link
                                >
                                    配置
                                </el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                </el-tab-pane>

                <el-tab-pane name="tree" label="实例树">
                    <div :style="{ height: tabHeight + 'px' }">
                        <vue3-tree-org v-if="treeTab.data != undefined" :data="treeTab.data" style="font: 8px">
                            <template v-slot="{ node }">
                                <div
                                    style="
                                        padding: 8px 15px;
                                        width: auto;
                                        white-space: nowrap;
                                        border-radius: 5px;
                                        font-size: 10px;
                                    "
                                    :style="{
                                        background: node.isLeaf ? 'var(--el-color-primary)' : 'var(--el-color-white)',
                                        color: node.isLeaf ? 'var(--el-color-white)' : 'var(--el-color-black)',
                                    }"
                                >
                                    <div>
                                        {{ node.label }}
                                    </div>
                                    <el-divider style="margin: 5px"></el-divider>
                                    <div class="info-wrap" style="font-size: 8px">
                                        <div>实现类型：{{ moduleStore.moduleMap.get(node.id)?.kind }}</div>
                                    </div>
                                </div>
                            </template>
                        </vue3-tree-org>
                    </div>
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
                        :header-cell-style="{
                            color: 'var(--el-color-black)',
                            background: 'var(--el-bg-color-page)',
                        }"
                        :height="tabHeight"
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
import { ModuleInfo, ModuleStatus, moduleStatusLabel, ModuleTreeNode } from "@/info/module";
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
            curTab: "module" as " module" | "docker" | "tree",
            tabHeight: 450,
            // 1. 模块 配置相关
            moduleStatusLabel,

            isVisible: false,
            selectModuleInfo: {} as ModuleInfo,
            toUpperAtFirst,

            //
            treeTab: {
                data: {} as ModuleTreeNode | undefined,
            },

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
    async mounted() {
        await this.updateTab(this.curTab);

        // window.addEventListener("resize", () => this.updateTabHeight());
        // this.updateTabHeight();
    },
    methods: {
        // 动态更新大小
        updateTabHeight() {
            this.$nextTick(() => {
                const height = document.getElementsByClassName("el-tabs").item(0)?.clientHeight;
                if (height != undefined) this.tabHeight = height - 50;

                console.log("height", height);
            });
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
        async updateTab(name: string) {
            // 当切换到 Docker 页面时，需要调用 API 重新加载
            if (name == "docker") {
                this.dockerTab.isLoading = true;
                const result = await moduleControlApi.getModuleDockerInfoList();

                this.dockerTab.infoList = result.data.list;
                this.dockerTab.isLoading = false;
            } else if (name == "tree") {
                const translateTree = (instance: ModuleTreeNode): any => {
                    let result = {
                        label: instance.alias,
                        id: `${instance.name}_${instance.kind}`,
                        children: [] as any[],
                        isLeaf: true,
                    };

                    if (instance.modules != undefined) {
                        result.children = instance.modules.map((subTree: any) => translateTree(subTree));
                        result.isLeaf = false;
                    }

                    return result;
                };

                const moduleTree = this.moduleStore.moduleTree;
                if (moduleTree == undefined) {
                    this.treeTab.data = undefined;
                    return;
                }

                this.treeTab.data = translateTree(moduleTree);
            }
        },
        async toChangeTab(pane: TabsPaneContext) {
            const name = pane.paneName;
            if (name != undefined) await this.updateTab(String(name));
        },
    },
    computed: {
        list() {
            return this.moduleStore.moduleList;
        },
    },
};
</script>

<style scoped>
.el-dialog {
    border-radius: 10px;
}
.info-wrap {
    color: var(--el-text-color-placeholder);
    font-size: 12px;
    line-height: 150%;
}
</style>
