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
                <el-table-column prop="kind" label="实现类型"> </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template #default="scope">
                        {{ statusLabel[scope.row.status] }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="toConfigModule(scope.row.name)" text
                            >配置</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </FunctionLayout>

        <el-dialog title="配置" v-model="config.visible" style="border-radius: 10px">
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
                            <el-option v-for="kind in config.kinds" :key="kind" :value="kind"></el-option>
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
                                v-if="config.infoTypeMap[key] == 'number'"
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
import { statusLabel } from "../../info/status";
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
                name: "",
                visible: false,
                kinds: [],
                list: {} as any,
                selectKind: undefined as undefined | string,
                isEditing: false,

                infoCopy: {} as any,
                infoTypeMap: {} as any,
            },
        };
    },
    methods: {
        async initList() {
            const resp = await moduleControlApi.getAllModuleList();
            this.list = resp.info.list;
        },

        async toConfigModule(name: string) {
            const resp = await moduleControlApi.getModuleConfig(name);

            if (resp == undefined) {
                return;
            }

            Object.assign(this.config, {
                name: name,
                visible: true,
                kinds: resp.info.kinds,
                list: resp.info.config,
            });

            console.log(this.config.kinds);
        },

        toOkInConfig() {
            const config = this.config;

            if (config.isEditing) {
                console.log(config.infoCopy, config.infoTypeMap);
                if (config.selectKind != undefined)
                    moduleControlApi.updateModuleConfig(config.name, config.selectKind, config.infoCopy);
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
    },
    async mounted() {
        await this.initList();
    },
};
</script>
