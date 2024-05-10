<template>
    <div class="row-wrap">
        <!-- Notice: 需要给两块地方单独设置一下占比 以解决宽度溢出的问题 -->
        <TalkArea style="width: 50%; height: 100%"></TalkArea>
    </div>
</template>

<script lang="ts">
import TalkArea from "@/components/function/interact/TalkArea.vue";

export default {
    components: {
        TalkArea,
    },
};
</script>

<style scoped>
.col-wrap {
    display: flex;
    flex-direction: column;
}
.row-wrap {
    display: flex;
    height: 100%;
}
</style>
