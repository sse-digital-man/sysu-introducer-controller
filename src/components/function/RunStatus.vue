<template>
    <FunctionLayout title="运行状态">
        <div id="content-wrap">
            <div style="margin-bottom: 100px">当前角色: {{ curRole }}</div>

            <!-- <div style="display: flex; align-items: center">
                <SvgIcon name="circle" size="16" :color="statusColor" />
                <span style="margin-left: 8px" :style="{ color: statusColor }">{{ status ? "运行中" : "停止中" }}</span>
            </div> -->
            <div class="control-wrap">
                <ModuleControlButton :status="status" :click="click"></ModuleControlButton>
                <span>{{ statusLabel[status] }}</span>
            </div>
            <!-- <div class="control-wrap">
                    <el-button color="var(--el-color-info-light-5)" circle>
                        <SvgIcon name="refresh" size="12" color="var(--el-color-white)"></SvgIcon>
                    </el-button>
                    <span>刷新状态</span>
                </div> -->
            <!-- <img :src="url" style="height: 300px"></img> -->
        </div>
    </FunctionLayout>
</template>

<script lang="ts">
import FunctionLayout from "../layout/FunctionLayout.vue";
import ModuleControlButton from "../ModuleControlButton.vue";

import { statusLabel, ModuleStatus } from "../../info/status";
import { moduleControlApi } from "../../api/module";

export default {
    components: {
        FunctionLayout,
        ModuleControlButton,
    },
    data() {
        return {
            curRole: "中小大",
            status: ModuleStatus.NotConnected,
            url: new URL("../../assets/image.png", import.meta.url).href,

            statusLabel,
        };
    },
    methods: {
        click() {
            switch (this.status) {
                case ModuleStatus.Stopped:
                    moduleControlApi.boot();
                    break;
                case ModuleStatus.Started:
                    moduleControlApi.shutDown();
                    break;
            }
        },
        async initStatus() {
            const resp = await moduleControlApi.getStatus();
            this.status = resp.data.status;
        },
    },
    async mounted() {
        window.ws.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            if (data.name == "booter") this.status = data["status"];
        });
        //初始化更新当前状态
        await this.initStatus();
    },
};
</script>

<style scoped>
#content-wrap {
    background-image: url(/src/assets/image.png);
    background-position: right bottom;
    background-repeat: no-repeat;
    background-size: auto 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    /* div {
        margin-top: 15px;
    } */
}
.control-wrap {
    display: flex;
    align-items: center;

    .el-button {
        size: 24px 24px;
    }
    span {
        margin-left: 10px;
    }
}
</style>
