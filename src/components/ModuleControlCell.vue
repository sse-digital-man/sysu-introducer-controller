<template>
    <div class="wrap">
        <div>
            <span id="title"> {{ title }} </span>
            <el-divider />
            <div id="status">状态: {{ statusLabel[status] }}</div>
        </div>
        <div>
            <el-button style="float: right" color="var(--el-color-info-light-9)" circle>
                <SvgIcon name="play" :size="24" color="green" />
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import SvgIcon from "./SvgIcon.vue";

import { statusLabel } from "../info/status";

export default {
    components: { SvgIcon },
    props: {
        title: {
            type: String,
            default: "标题",
        },
        status: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            statusLabel,
        };
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
#status {
    color: var(--el-text-color-placeholder);
    font-size: 12px;
}
.wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    padding: 15px;
    box-sizing: border-box;

    height: 100%;
    width: 180px;

    border: 1px solid var(--el-border-color);
    border-radius: 15px;
}

.el-divider {
    margin: 10px 0;
}
</style>
