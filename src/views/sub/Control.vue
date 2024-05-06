<template>
    <div class="col-wrap">
        <div class="row-wrap" style="height: auto">
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
import RunStatus from "../../components/function/RunStatus.vue";
import ModuleControl from "../../components/function/ModuleControl.vue";
import ModuleConfig from "../../components/function/ModuleConfig.vue";
import LogDisplay from "../../components/function/LogDisplay.vue";

export default {
    components: {
        RunStatus,
        ModuleControl,
        ModuleConfig,
        LogDisplay,
    },
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
    margin: 10px;
}
</style>
