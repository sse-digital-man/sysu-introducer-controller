<template>
    <FunctionLayout title="发送消息">
        <div id="main-wrap">
            <!-- 历史聊天记录 -->
            <div id="history-wrap">
                <div v-for="message in messages" class="message-wrap" :id="message.role">
                    <div style="width: 32px; height: 32px">
                        <el-icon v-if="message.role == 'user'" size="20px"><User /></el-icon>
                        <el-image
                            v-else-if="message.role == 'assistant'"
                            style="border-radius: 50%"
                            :src="avatarUrl"
                        ></el-image>
                    </div>
                    <div id="content-wrap">{{ message.content }}</div>
                </div>
            </div>
            <!-- 操作区域 -->
            <div id="operation-wrap">
                <el-input v-model="input" placeholder="输入文本发送消息" size="large"></el-input>
                <el-button circle type="primary" style="margin-left: 15px">
                    <el-icon size="24px"> <Right /></el-icon>
                </el-button>
            </div>
        </div>
    </FunctionLayout>
</template>

<script lang="ts">
import { User, Right } from "@element-plus/icons-vue";

import { getUrl } from "@/utils";
import FunctionLayout from "@/components/layout/FunctionLayout.vue";

export default {
    components: {
        User,
        Right,
        FunctionLayout,
    },
    data() {
        return {
            input: "",
            avatarUrl: getUrl("avatar.png"),
            messages: [
                {
                    role: "user",
                    content: "介绍一下自己",
                },
                {
                    role: "assistant",
                    content: "你好，我是中大介绍官中小大",
                },
            ],
        };
    },
};
</script>

<style scoped>
#main-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
}
#history-wrap {
    border: 1px solid var(--el-border-color);
    border-radius: 10px;
    box-sizing: border-box;
    margin-bottom: 15px;
    padding: 15px;

    height: 100%;
}
#operation-wrap {
    display: flex;
    align-items: center;
}
.message-wrap {
    display: flex;
    margin-bottom: 20px;

    #content-wrap {
        padding: 10px;
        border-radius: 5px;

        font-size: 14px;
    }
}
#user {
    flex-direction: row-reverse;

    #content-wrap {
        background-color: var(--el-bg-color-page);
        color: var(--el-color-black);

        margin-right: 10px;
    }

    .el-icon {
        background-color: var(--el-bg-color-page);
        color: var(--el-text-color-regular);

        /* 这里需要单独设置 */
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}
#assistant {
    #content-wrap {
        background-color: var(--el-color-primary);
        color: var(--el-color-white);

        margin-left: 10px;
    }
}
</style>
