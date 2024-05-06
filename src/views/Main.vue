<template>
    <el-container style="height: 100%">
        <el-aside style="width: 200px">
            <SideBar title="数字人控制器" :menu-items="menuItems"></SideBar>
        </el-aside>
        <el-main id="main-wrap">
            <RouterView></RouterView>
        </el-main>
    </el-container>
</template>

<script lang="ts">
import { Operation, Message, Setting } from "@element-plus/icons-vue";
import SideBar from "../components/SideBar.vue";

export default {
    components: {
        SideBar,
    },
    data() {
        return {
            menuItems: [
                { name: "control", label: "模块控制", icon: Operation },
                { name: "interact", label: "消息交互", icon: Message },
                { name: "config", label: "系统配置", icon: Setting },
            ],
        };
    },
    methods: {},
    created() {
        // 进入主界面的时候 将 websocket 挂载在 window 上
        const ws = new WebSocket("ws://127.0.0.1:8083");
        ws.onopen = () => console.log("connected");
        window.ws = ws;
    },
};
</script>

<style>
.el-menu {
    /* 去掉有右边界线 */
    border-right: 0 !important;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
#title {
    color: var(--el-color-white);
    text-align: center;
    font-size: 24px;
    padding: 15px;
    padding-bottom: 20px;
}
#main-wrap {
    background-color: var(--el-bg-color-page);
    margin: 0;

    overflow-x: hidden;
}
</style>
