<template>
    <FunctionLayout title="运行状态">
        <div id="content-wrap">
            <div style="margin-bottom: 100px">当前角色: {{ curRole }}</div>

            <!-- <div style="display: flex; align-items: center">
                <SvgIcon name="circle" size="16" :color="statusColor" />
                <span style="margin-left: 8px" :style="{ color: statusColor }">{{ status ? "运行中" : "停止中" }}</span>
            </div> -->
            <div class="control-wrap">
                <el-button color="var(--el-color-info-light-9)" @click="changeStatus()" circle>
                    <SvgIcon name="play" :size="24" color="green" />
                </el-button>
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
import SvgIcon from "../SvgIcon.vue";

export default {
    components: {
        FunctionLayout,
        SvgIcon,
    },
    data() {
        return {
            curRole: "中小大",
            status: 0,

            statusLabel: ["未运行", "启动中", "运行中", "停止中"] as string[],

            url: new URL("../../assets/image.png", import.meta.url).href,
        };
    },
    methods: {
        changeStatus() {
            this.status = (this.status + 1) % 4;
        },
    },
    computed: {
        statusColor(): string {
            return this.status ? "green" : "red";
        },
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
