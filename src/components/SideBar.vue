<template>
    <el-menu default-active="0" :router="true" background-color="var(--el-color-primary)">
        <div>
            <h1 id="title">{{ title }}</h1>
            <!--  -->
            <el-menu-item
                v-for="(item, index) in menuItems"
                :index="index.toString()"
                :route="item.name"
                style="margin-left: 15px; border-radius: 5px 0 0 5px"
                :style="{
                    'background-color':
                        $route.name == item.name ? 'var(--el-bg-color-page)' : 'var(--el-color-primary)',
                    color: $route.name == item.name ? 'var(--el-color-primary)' : 'var(--el-bg-color-page)',
                }"
            >
                <el-icon>
                    <!-- Notice:  使用 {...item.icon} 以防止警告-->
                    <component :is="{ ...item.icon }"></component>
                </el-icon>
                <span>{{ item.label }}</span>
            </el-menu-item>
        </div>

        <CopyRight></CopyRight>
    </el-menu>
</template>

<script lang="ts">
import { PropType } from "vue";
import CopyRight from "../components/CopyRight.vue";

declare interface MenuItem {
    label: string;
    name: string;
    icon: any;
}

export default {
    components: {
        CopyRight,
    },
    props: {
        title: {
            type: String,
            default: "标题",
        },
        menuItems: {
            type: Object as PropType<MenuItem[]>,
            required: true,
        },
    },
};
</script>

<style scoped>
#title {
    color: var(--el-color-white);
    text-align: center;
    font-size: 24px;
    padding: 15px;
    padding-bottom: 20px;
}
</style>
