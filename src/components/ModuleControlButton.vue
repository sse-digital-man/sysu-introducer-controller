<template>
    <el-button @click="click()" :loading="isLoading" :disabled="info.disabled" circle>
        <template #icon>
            <div v-html="info.icon" :style="{ 'font-size': '24px', color: info.color }" />
        </template>
        <template #loading>
            <el-icon>
                <div
                    v-html="Refresh"
                    :style="{ 'font-size': '24px', color: 'gray' }"
                    style="animation: loading-rotate 2s linear infinite"
                />
            </el-icon>
        </template>
    </el-button>
</template>

<script lang="ts">
import { ModuleStatus } from "../info/module";
import SvgIcon from "./SvgIcon.vue";

import Play from "../assets/icons/play.svg?raw";
import Pause from "../assets/icons/pause.svg?raw";
import Refresh from "../assets/icons/refresh.svg?raw";
import X from "../assets/icons/x.svg?raw";

export default {
    components: {
        SvgIcon,
    },
    props: {
        click: {
            type: Function,
            default: () => {},
        },
        status: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            info: {
                icon: Object as any,
                color: "red",
                disabled: true,
            },
            Play,
            Pause,
            Refresh,
            X,
        };
    },
    methods: {
        updateStatus(newStatus: ModuleStatus) {
            let icon = {} as any;
            let color = "";
            let disabled = false;
            switch (newStatus) {
                case ModuleStatus.Started:
                    color = "red";
                    icon = Pause;
                    break;
                case ModuleStatus.Stopped:
                    color = "green";
                    icon = Play;
                    break;
                case ModuleStatus.NotConnected:
                case ModuleStatus.NotLoaded:
                case ModuleStatus.StartError:
                case ModuleStatus.RunError:
                case ModuleStatus.StopError:
                    color = "red";
                    icon = X;
                    disabled = true;
                    break;
            }

            this.info = {
                color,
                icon,
                disabled,
            };
        },
    },
    created() {
        this.updateStatus(this.status);
    },
    computed: {
        isLoading(): boolean {
            const status = this.status;
            return status == ModuleStatus.Starting || status == ModuleStatus.Stopping;
        },
    },
    watch: {
        status: {
            handler(newStatus, _oldStatus) {
                this.updateStatus(newStatus);
            },
        },
    },
};
</script>
