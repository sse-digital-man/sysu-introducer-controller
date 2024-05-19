<template>
    <FunctionLayout title="日志显示">
        <el-table :data="log">
            <el-table-column prop="time" label="时间"  width="180"></el-table-column>
            <el-table-column prop="content" label="内容" ></el-table-column>
            <el-table-column prop="logKind" label="类型" :filters="moduleLogKindFilters" :filter-method="filterModuleLogKind" width="100" >
                <template #default=scope>
                    {{ moduleLogKindLabelMap.get(scope.row.logKind) }}
                </template>
            </el-table-column>

        </el-table>
     </FunctionLayout>
</template>

<script lang="ts">
import FunctionLayout from "@/components/layout/FunctionLayout.vue";
import { useLogStore } from "@/store";
import { ModuleLogKind, moduleLogKindLabelMap } from "@/info/log";

export default {
    setup() {
        const moduleLogKindFilters = [] as {text: string, value: ModuleLogKind}[];
        moduleLogKindLabelMap.forEach(
            (key, value) =>moduleLogKindFilters.push({text: key, value})
        )

        console.log(moduleLogKindFilters)

        return {
            logStore: useLogStore(),
            moduleLogKindLabelMap,
            moduleLogKindFilters
        }
    },
    components: {
        FunctionLayout,
    },
    methods: {
        filterModuleLogKind(value: ModuleLogKind, row: {logKind: ModuleLogKind}) {
            return value == row.logKind;
        }
    },
    computed: {
        log() {
            console.log(this.logStore.log.length)
            return this.logStore.log;
        }
    }
}
</script>
