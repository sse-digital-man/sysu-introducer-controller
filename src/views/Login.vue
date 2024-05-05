<template>
    <!-- <a>hello</a> -->
    <div id="background">
        <div></div>
        <div>
            <p id="title">数字人控制器</p>
            <div id="login-wrap">
                <h1 id="sub-title">管理员登录</h1>
                <el-form :model="loginInfo" label-suffix="： ">
                    <el-form-item label="账号">
                        <el-input v-model="loginInfo.account"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="loginInfo.password"></el-input>
                    </el-form-item>
                </el-form>
                <div style="text-align: center">
                    <el-button type="primary" @click="toLogin">登录</el-button>
                </div>
            </div>
        </div>

        <copy-right></copy-right>
    </div>
</template>

<script lang="ts">
import CopyRight from "../components/CopyRight.vue";

export default {
    components: {
        CopyRight,
    },
    data() {
        return {
            loginInfo: {
                account: "",
                password: "",
            },
        };
    },
    methods: {
        toLogin() {
            console.log(this.loginInfo);
        },
    },
};
</script>

<style>
#background {
    background-color: var(--el-color-primary);
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}
#title {
    text-align: center;
    color: var(--el-color-white);
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 15px;
}
#sub-title {
    font-size: 24px;
    color: var(--el-color-primary);
}
#login-wrap {
    width: 400px;
    height: 300px;
    box-sizing: border-box;
    padding: 40px 40px;

    border-radius: 12px;
    background-color: var(--el-color-white);

    display: flex;
    justify-content: space-between;
    flex-direction: column;
}
</style>
