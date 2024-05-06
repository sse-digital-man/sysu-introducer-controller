<template>
    <div class="col-wrap">
        <div class="row-wrap">
            <RunStatus></RunStatus>
            <ModuleControl style="margin-left: 20px"></ModuleControl>
        </div>
        <div class="row-wrap" style="height: 100%">
            <ModuleConfig></ModuleConfig>
            <LogDisplay style="margin-left: 20px"></LogDisplay>
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
