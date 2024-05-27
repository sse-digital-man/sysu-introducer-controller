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

        <el-dialog title="配置" v-model="config.visible">
            <div style="display: flex; flex-direction: column">
                <el-form label-width="auto" label-suffix=": ">
                    <!-- 选择实现类型 -->
                    <el-form-item label="实现类型">
                        <el-select
                            v-model="config.selectKind"
                            placeholder="请选择实现类型"
                            @change="toChangeModuleKind(config.selectKind)"
                            @focus="config.previousKind = config.info.kind"
                            :disabled="config.isEditing"
                        >
                            <el-option v-for="kind in config.info.kinds" :key="kind" :value="kind"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- 编辑配置信息 -->
                    <div v-if="config.selectKind != undefined">
                        <el-divider></el-divider>
                        <el-form-item v-for="key in Object.keys(config.infoCopy)" :label="key">
                            <!-- 布尔类型 -->
                            <el-switch
                                :disabled="!config.isEditing"
                                v-if="config.infoTypeMap[key] == 'boolean'"
                                v-model="config.infoCopy[key]"
                            />
                            <!-- 数字类型 -->
                            <el-input
                                :disabled="!config.isEditing"
                                v-else-if="config.infoTypeMap[key] == 'number'"
                                v-model.number="config.infoCopy[key]"
                                :type="config.infoTypeMap[key]"
                            ></el-input>
                            <!-- 字符串类型 -->
                            <el-input :disabled="!config.isEditing" v-else v-model="config.infoCopy[key]"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <template #footer>
                <el-button type="primary" @click="toOkInConfig()" :disabled="config.selectKind == undefined">
                    {{ config.isEditing ? "确认" : "编辑" }}
                </el-button>
                <el-button @click="toCancelInConfig()">
                    {{ config.isEditing ? "取消" : "返回" }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { ElMessageBox } from "element-plus";

import { toUpperAtFirst } from "@/utils";

import FunctionLayout from "@/components/layout/FunctionLayout.vue";

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
    },
    data() {
        return {
            statusLabel,

            // 配置相关
            config: {
                visible: false,
                info: {} as ModuleInfo,
                list: {} as any,

                // 与编辑配置有关
                selectKind: "" as string,
                infoCopy: {} as any,
                infoTypeMap: {} as any,
                isEditing: false,

                // 与切换有关
                previousKind: "",
            },

            toUpperAtFirst,
        };
    },
    methods: {
        async initList() {
            const resp = await moduleControlApi.getAllModuleList();
            this.list = resp.data.list;
        },

        async toConfigModule(info: ModuleInfo) {
            const resp = await moduleControlApi.getModuleConfig(info.name);

            // 返回为空说明无配置内容
            if (resp == undefined) {
                ElMessageBox.alert("该模块无配置内容", "提示", {
                    confirmButtonText: "确定",
                });
                return;
            }

            Object.assign(this.config, {
                info: info,
                selectKind: info.kind,
                visible: true,
                isEditing: false,
                changeKind: info.kind,
                list: resp.data.config,
            });

            this.refreshConfigInfoCopy();
        },
        // 切换模块的实现类型
        async toChangeModuleKind(newKind: string) {
            if (newKind == this.config.previousKind) return;

            const info = this.config.info;
            ElMessageBox.alert("你确定要切换模块实现类型吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: true,
            })
                .then(async () => {
                    // 确认切换时，调用 API 切换，并修改实现类型
                    await moduleControlApi.changeModuleKind(info.name, newKind);
                    info.kind = newKind;

                    // 刷新配置信息
                    this.refreshConfigInfoCopy();
                })
                .catch(() => {
                    // 复原实现类型
                    this.config.selectKind = this.config.previousKind;
                });
        },
        toOkInConfig() {
            const config = this.config;

            if (config.isEditing) {
                if (config.selectKind != undefined)
                    moduleControlApi.updateModuleConfig(config.info.name, config.selectKind, config.infoCopy);
            }

            this.config.isEditing = !this.config.isEditing;
        },
        toCancelInConfig() {
            const config = this.config;

            if (config.isEditing) {
                ElMessageBox.alert("你确定要取消编辑吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    showCancelButton: true,
                }).then(() => {
                    this.refreshConfigInfoCopy();
                    config.isEditing = false;
                });
            } else {
                config.visible = false;
                config.selectKind = "";
            }
        },
        // Copy 模块的配置信息，作为配置信息的修改副本
        refreshConfigInfoCopy() {
            const config = this.config;

            // 存储配置信息
            config.infoCopy = {} as any;
            Object.assign(config.infoCopy, config.list[config.selectKind]);

            // 存储原始类型
            let infoTypeMap = {} as any;
            for (let [key, value] of Object.entries(config.infoCopy)) {
                infoTypeMap[key] = typeof value;
            }
            config.infoTypeMap = infoTypeMap;
        },
        checkCanChange(status: ModuleStatus) {
            return status == ModuleStatus.NotLoaded || status == ModuleStatus.Stopped;
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
