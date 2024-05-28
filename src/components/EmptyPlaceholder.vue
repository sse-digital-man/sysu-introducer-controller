<template>
    <div class="empty-wrap" :style="{ height: height + 'px' }">
        <el-icon style="font-size: 24px; margin-bottom: 5px"><InfoFilled /></el-icon>
        {{ text }}
    </div>
</template>

<script>
import { InfoFilled } from "@element-plus/icons-vue";
export default {
    components: {
        InfoFilled,
    },
    props: {
        text: String,
        height: {
            type: Number,
            default: 150,
        },
    },
};
</script>

<style scoped>
.empty-wrap {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    padding: 15px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    color: gray;
    border: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color-page);
}
</style>
