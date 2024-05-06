<template>
    <FunctionLayout title="运行状态">
        <div id="content-wrap">
            <div style="margin-bottom: 100px">当前角色: {{ curRole }}</div>

            <!-- <div style="display: flex; align-items: center">
                <SvgIcon name="circle" size="16" :color="statusColor" />
                <span style="margin-left: 8px" :style="{ color: statusColor }">{{ status ? "运行中" : "停止中" }}</span>
            </div> -->
            <div class="control-wrap">
                <el-button color="var(--el-color-info-light-9)" @click="click()" :loading="isLoading" circle>
                    <template #icon>
                        <SvgIcon :name="status.icon" :size="24" :color="status.color" />
                    </template>
                    <template #loading>
                        <SvgIcon
                            name="refresh"
                            :size="24"
                            style="animation: loading-rotate 2s linear infinite"
                            :color="status.color"
                        />
                    </template>
                </el-button>
                <span>{{ statusLabel[status.value] }}</span>
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
import SvgIcon from "../SvgIcon.vue";

import { statusLabel, ModuleStatus } from "../../info/status";
import { moduleControlApi } from "../../api/module";

export default {
    components: {
        FunctionLayout,
        SvgIcon,
    },
    data() {
        return {
            curRole: "中小大",
            status: {
                value: ModuleStatus.Stopping,
                color: "",
                icon: "",
            },
            url: new URL("../../assets/image.png", import.meta.url).href,

            statusLabel,
        };
    },
    methods: {
        click() {
            switch (this.status.value) {
                case ModuleStatus.Stopped:
                    moduleControlApi.boot();
                    break;
                case ModuleStatus.Started:
                    moduleControlApi.shutDown();
                    break;
            }
        },
        async initStatus() {
            const status = await moduleControlApi.getStatus();
            this.updateStatus(status.info.status);
        },
        updateStatus(newStatus: ModuleStatus) {
            let icon = "";
            let color = "";
            switch (newStatus) {
                case ModuleStatus.Started:
                    color = "red";
                    icon = "pause";
                    break;
                case ModuleStatus.Stopped:
                    color = "green";
                    icon = "play";
                    break;
                case ModuleStatus.Starting:
                case ModuleStatus.Stopping:
                    color = "gray";
                    icon = "refresh";
                    break;
            }

            this.status = {
                value: newStatus,
                color,
                icon,
            };

            // console.log(this.status);
        },
    },
    computed: {
        isLoading(): boolean {
            const status = this.status.value;
            return status == ModuleStatus.Starting || status == ModuleStatus.Stopping;
        },
    },
    async mounted() {
        //初始化更新当前状态
        await this.initStatus();

        window.ws.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            if (data.name != "booter") return;

            // console.log(data);
            // this.status = data["status"];
            this.updateStatus(data["status"]);
        });
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
