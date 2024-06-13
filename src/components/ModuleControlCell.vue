<template>
    <div class="wrap">
        <div>
            <span id="title"> {{ info.alias }} </span>
            <el-divider />
            <div id="info-wrap">状态: {{ moduleStatusLabel.get(info.status) }}</div>
            <div id="info-wrap">类型: {{ info.kind }}</div>
        </div>
        <div>
            <ModuleControlButton style="float: right" :status="info.status" :click="click" />
        </div>
    </div>
</template>

<script lang="ts">
import { PropType } from "vue";

import ModuleControlButton from "./ModuleControlButton.vue";

import { moduleControlApi } from "../api";
import { ModuleStatus, moduleStatusLabel } from "../info/module";
import { ModuleInfo } from "../info/module";

export default {
    components: { ModuleControlButton },
    props: {
        info: {
            type: Object as PropType<ModuleInfo>,
            required: true,
        },
    },
    data() {
        return {
            moduleStatusLabel,
        };
    },
    methods: {
        async click() {
            switch (this.info.status) {
                case ModuleStatus.Started:
                    moduleControlApi.stopModule(this.info.name);
                    break;
                case ModuleStatus.Stopped:
                    moduleControlApi.startModule(this.info.name);
                    break;
            }
        },
    },
};
</script>

<style scoped>
#title {
    color: var(--el-color-black);
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    padding: 0;
}
#info-wrap {
    color: var(--el-text-color-placeholder);
    font-size: 12px;
    line-height: 150%;
}
.wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    padding: 15px;
    box-sizing: border-box;

    height: 100%;
    width: 200px;

    border: 1px solid var(--el-border-color);
    border-radius: 15px;
}

.el-divider {
    margin: 10px 0;
}
</style>
