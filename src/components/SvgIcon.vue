<template>
    <!-- 通过变量设置属性 -->

    <el-icon :style="{ 'font-size': size + 'px' }">
        <Icon :style="{ fill: color }"></Icon>
    </el-icon>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: 32,
    },
    color: {
        type: String,
        default: "black",
    },
});

const Icon = defineAsyncComponent(() => import(`../assets/icons/${props.name}.svg`));
</script>
