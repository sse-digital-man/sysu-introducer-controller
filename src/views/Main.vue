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

import { moduleControlApi } from "@/api";

import { ModuleLogKind } from "@/info/log";
import { ASSISTANT, MessageKind } from "@/info/message";
import { useMessageStore, useModuleStore } from "@/store";

export default {
    components: {
        SideBar,
    },
    setup() {
        return {
            messageStore: useMessageStore(),
            moduleStore: useModuleStore(),
        };
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
    async created() {
        // 进入主界面的时候 将 websocket 挂载在 window 上
        const ws = new WebSocket("ws://127.0.0.1:8083");
        ws.onopen = () => console.log("connected");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            const kind = data.kind,
                content = data.content;

            switch (kind) {
                case ModuleLogKind.Message:
                    if (content.kind == MessageKind.Assistant && content.toAdmin) {
                        this.messageStore.appendHistoryMessage(ASSISTANT, content.content);
                    }
                    break;
                case ModuleLogKind.ModuleStatus:
                    this.moduleStore.updateModuleStatus(content.name, content.status);
                    break;
            }
        };

        // 初始化全局模块信息表
        const modules = await moduleControlApi.getAllModuleList();
        this.moduleStore.initModule(modules.data.list);

        // window.ws.addEventListener("message", this.events);
    },
};
</script>

<style scoped>
.el-menu {
    /* 去掉有右边界线 */
    border-right: 0 !important;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
#main-wrap {
    background-color: var(--el-bg-color-page);
    margin: 0;

    overflow-x: hidden;
}
</style>
