<template>
    <div class="col-wrap">
        <div class="row-wrap" style="height: 30%; margin-bottom: 20px">
            <!-- Notice: 需要给两块地方单独设置一下占比 以解决宽度溢出的问题 -->
            <RunStatus style="width: 30%"></RunStatus>
            <ModuleControl style="width: 70%; margin-left: 20px"></ModuleControl>
        </div>
        <div class="row-wrap" style="height: 70%">
            <ModuleConfig style="width: 50%"></ModuleConfig>
            <LogDisplay style="width: 50%; margin-left: 20px"></LogDisplay>
        </div>
    </div>
</template>

<script lang="ts">
import RunStatus from "@/components/function/control/RunStatus.vue";
import ModuleControl from "@/components/function/control/ModuleControl.vue";
import ModuleConfig from "@/components/function/control/ModuleConfig.vue";
import LogDisplay from "@/components/function/control/LogDisplay.vue";

export default {
    components: {
        RunStatus,
        ModuleControl,
        ModuleConfig,
        LogDisplay,
    },
    async created() {},
};
</script>

<style scoped>
.col-wrap {
    display: flex;
    flex-direction: column;

    height: 100%;
}
.row-wrap {
    display: flex;
    justify-content: space-between;
}
</style>
