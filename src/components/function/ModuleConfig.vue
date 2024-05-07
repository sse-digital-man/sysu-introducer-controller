<template>
    <div>
        <FunctionLayout title="模块配置">
            <el-table
                :data="list"
                :header-cell-style="{ color: 'var(--el-color-black)', background: 'var(--el-bg-color-page)' }"
            >
                <el-table-column prop="name" label="名称">
                    <template #default="scope">
                        <span style="font-weight: bold"> {{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="alias" label="别名" min-width="120px"></el-table-column>
                <el-table-column prop="kind" label="实现类型" min-width="100px">
                    <!-- 在表格内切换实现类型-->
                    <template #default="scope">
                        <!-- Basic 类型不能进行切换 -->
                        <span v-if="scope.row.kind == 'basic'"> {{ scope.row.kind }}</span>
                        <el-select
                            v-model="scope.row.kind"
                            v-else
                            :disabled="!checkCanChange(scope.row.status)"
                            @change="toChangeModuleKind(scope.row)"
                            @focus="config.previousKind = scope.row.kind"
                            placeholder="请选择实现类型"
                        >
                            <el-option v-for="kind in scope.row.kinds" :key="kind" :value="kind"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template #default="scope">
                        {{ statusLabel[scope.row.status] }}
                    </template>
                </el-table-column>

                <!-- 操作栏 -->
                <el-table-column label="操作">
                    <template #default="scope">
                        <div style="display: flex; justify-content: center">
                            <!-- 如果实现类型为空 则不能配置 -->
                            <el-button type="info" size="small" @click="toConfigModule(scope.row)" link>
                                配置
                            </el-button>
                        </div>
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
                            @change="refreshConfigInfoCopy"
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
import FunctionLayout from "../layout/FunctionLayout.vue";

import { ModuleInfo } from "../../info/module";
import { ModuleStatus, statusLabel } from "../../info/status";
import { moduleControlApi } from "../../api";
import { ElMessageBox } from "element-plus";

export default {
    components: {
        FunctionLayout,
    },
    data() {
        return {
            list: [] as ModuleInfo[],
            statusLabel,

            // 配置相关
            config: {
                visible: false,
                info: {} as ModuleInfo,
                list: {} as any,

                // 与编辑配置有关
                selectKind: undefined as undefined | string,
                infoCopy: {} as any,
                infoTypeMap: {} as any,
                isEditing: false,

                // 与切换有关
                previousKind: "",
            },
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
                visible: true,
                isEditing: false,
                changeKind: info.kind,
                list: resp.data.config,
            });
        },
        async toChangeModuleKind(info: ModuleInfo) {
            if (info.kind == this.config.previousKind) return;

            const newKind = info.kind;
            info.kind = this.config.previousKind;

            ElMessageBox.alert("你确定要切换模块实现类型吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: true,
            })
                .then(async () => {
                    await moduleControlApi.changeModuleKind(info.name, newKind);
                    info.kind = newKind;
                })
                .catch(() => {});
        },
        toOkInConfig() {
            const config = this.config;

            if (config.isEditing) {
                console.log(config.infoCopy, config.infoTypeMap);
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
                config.selectKind = undefined;
            }
        },
        refreshConfigInfoCopy() {
            const config = this.config;

            if (config.selectKind != undefined) {
                // 存储配置信息
                config.infoCopy = {} as any;
                Object.assign(config.infoCopy, config.list[config.selectKind]);

                // 存储原始类型
                let infoTypeMap = {} as any;
                for (let [key, value] of Object.entries(config.infoCopy)) {
                    infoTypeMap[key] = typeof value;
                }
                config.infoTypeMap = infoTypeMap;
            }
        },
        checkCanChange(status: ModuleStatus) {
            return status == ModuleStatus.NotLoaded || status == ModuleStatus.Stopped;
        },
    },
    async mounted() {
        await this.initList();
    },
};
</script>

<style>
.el-dialog {
    border-radius: 10px;
}
</style>
