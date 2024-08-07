<template>
    <el-dialog title="配置内容" v-model="isVisible" :before-close="toClose">
        <div style="display: flex; flex-direction: column">
            <el-form label-width="auto" label-suffix=": ">
                <!-- 选择实现类型 -->
                <el-form-item label="实现类型">
                    <!-- 暂时未实现 -->
                    <div>暂时未实现</div>
                    <!-- <el-select
                        v-model="selectKind"
                        placeholder="请选择实现类型"
                        @change="toChangeModuleKind(selectKind)"
                        @focus="previousKind = info.kind"
                        :disabled="isEditing"
                    >
                        <el-option v-for="kind in info.kinds" :key="kind" :value="kind"></el-option>
                    </el-select> -->
                </el-form-item>
            </el-form>
            <div v-if="configMap != undefined">
                <el-divider style="margin: 0 0 20px 0"></el-divider>

                <el-form label-width="auto" label-suffix=": ">
                    <!-- 编辑配置信息 -->
                    <el-form-item v-for="[key, content] in configMap.entries()" :label="content.label">
                        <!-- 布尔类型 -->
                        <el-switch
                            :disabled="!isEditing"
                            v-if="content.type == 'boolean'"
                            v-model="configValueCopy[key]"
                        />
                        <!-- 数字类型 -->
                        <el-input
                            :readonly="!isEditing"
                            v-else-if="content.type == 'number'"
                            v-model.number="configValueCopy[key]"
                            :type="content.type"
                        ></el-input>
                        <!-- 字符串类型 -->
                        <el-input :readonly="!isEditing" v-else v-model="configValueCopy[key]"></el-input>
                    </el-form-item>
                </el-form>

                <div style="text-align: right">
                    <el-button @click="toCancelInConfig()" v-if="isEditing"> 取消 </el-button>
                    <el-button type="primary" @click="toOkInConfig()" :disabled="selectKind == undefined">
                        {{ isEditing ? "保存" : "编辑" }}
                    </el-button>
                </div>
            </div>

            <EmptyPlaceholder text="无配置信息" v-else />
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { ElMessageBox } from "element-plus";

import { PropType } from "vue";
import { isVisible } from "element-plus/es/utils/index.mjs";

import EmptyPlaceholder from "@/components/EmptyPlaceholder.vue";

import { ModuleConfigItem } from "@/info/config";
import { ModuleInfo } from "@/info/module";
import { moduleControlApi } from "@/api";
import { useModuleStore } from "@/store";

export default {
    setup() {
        return {
            moduleStore: useModuleStore(),
        };
    },
    components: {
        EmptyPlaceholder,
    },
    props: {
        info: {
            type: Object as PropType<ModuleInfo>,
            required: true,
        },
    },
    emits: ["update:visible"],
    data() {
        return {
            visible: false,

            // 与编辑配置有关
            selectKind: "" as string,
            isEditing: false,

            configMap: new Map() as Map<string, ModuleConfigItem> | undefined,
            configValueCopy: {} as any,

            // 与切换有关
            previousKind: "" as string,
        };
    },
    // 每次打开 Dialog 时刷新内容
    updated() {
        // 返回为空说明无配置内容
        Object.assign(this, {
            configMap: this.moduleStore.getModuleInstantConfig(this.info.name, this.info.kind),
            selectKind: this.info.kind,
            isEditing: false,
            changeKind: this.info.kind,
        });

        this.refreshConfigInfoCopy();
    },
    methods: {
        async init() {},
        // 切换模块的实现类型
        async toChangeModuleKind(newKind: string) {
            if (newKind == this.previousKind) return;

            const info = this.info;
            ElMessageBox.alert("你确定要切换模块实现类型吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: true,
            })
                .then(async () => {
                    // 确认切换时，调用 API 切换，并修改实现类型
                    await moduleControlApi.changeModuleKind(info.name, newKind);
                    info.kind = newKind;
                    this.configMap = this.moduleStore.getModuleInstantConfig(this.info.name, this.info.kind);

                    // Notice: 避免切换
                    this.previousKind = newKind;

                    // 刷新配置信息
                    this.refreshConfigInfoCopy();
                })
                .catch(() => {
                    // 复原实现类型
                    this.selectKind = this.previousKind;
                });
        },
        toOkInConfig() {
            if (this.isEditing) {
                moduleControlApi.updateModuleConfig(this.info.name, this.selectKind, this.configValueCopy);
            }

            this.isEditing = !this.isEditing;
        },
        toCancelInConfig() {
            if (this.isEditing) {
                ElMessageBox.alert("你确定要取消编辑吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    showCancelButton: true,
                }).then(() => {
                    this.refreshConfigInfoCopy();
                    this.isEditing = false;
                });
            }
        },
        // 关闭 Dialog 之前的验证内容
        async toClose(done: Function) {
            let close = true;

            if (this.isEditing) {
                await ElMessageBox.alert("退出后修改记录将不会被保存，你确定要退出吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    showCancelButton: true,
                }).catch(() => (close = false));
            }

            if (close) done();
        },
        // Copy 模块的配置信息，作为配置信息的修改副本
        refreshConfigInfoCopy() {
            if (this.configMap == undefined) {
                this.configValueCopy = undefined;
                return;
            }

            // 存储配置信息
            const configValueCopy = {} as any;

            for (let [field, content] of this.configMap.entries()) {
                configValueCopy[field] = content.value;
            }

            this.configValueCopy = configValueCopy;
        },
    },
    computed: {
        isVisible: {
            get() {
                return this.visible;
            },
            set(value: boolean) {
                this.$emit("update:visible", value);
            },
        },
    },
};
</script>
