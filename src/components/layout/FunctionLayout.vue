<template>
    <div id="wrap">
        <span id="title">{{ title }}</span>
        <slot name="default"></slot>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "标题",
        },
    },
};
</script>

<style scoped>
#wrap {
    background: var(--el-color-white);
    border-radius: 15px;
    padding: 15px;
    box-sizing: border-box;

    font-size: 16px;

    display: flex;
    flex-direction: column;

    height: auto;
    width: auto;
}
#title {
    color: var(--el-color-black);
    text-align: left;
    font-size: 20px;
    font-weight: bold;
    padding: 0;
    padding-bottom: 15px;
}
</style>
