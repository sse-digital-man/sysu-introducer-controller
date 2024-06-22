export interface ModuleInfo {
    name: string;
    alias: string;
    kind: string;
    status: ModuleStatus;
    modules: string[];
}

export interface ModuleTreeNode {
    name: string;
    alias: string;
    kind: string;
    status: ModuleStatus;
    modules: ModuleTreeNode[];
}

// modules 会嵌套很多内容，将 TreeNode 转换成 Info，可以节约内存开销
export const toInfo = (node: ModuleTreeNode) => {
    let info = {
        name: node.name,
        alias: node.alias,
        kind: node.kind,
        status: node.status,
    } as ModuleInfo;

    if (node.modules != undefined) {
        info.modules = node.modules.map((subNode) => subNode.name);
    }

    return info;
};

export enum ModuleStatus {
    NotConnected = -1,
    NotLoaded = 0,
    Stopped = 1,
    Starting = 2,
    Started = 3,
    Stopping = 4,

    // 发生异常，模块发生异常，就相当于
    StartError = 5,
    RunError = 6,
    StopError = 7,
}

export const moduleStatusLabel: Map<ModuleStatus, string> = new Map([
    [ModuleStatus.NotConnected, "未连接"],
    [ModuleStatus.NotLoaded, "未加载"],
    [ModuleStatus.Stopped, "停止中"],
    [ModuleStatus.Starting, "启动中"],
    [ModuleStatus.Started, "运行中"],
    [ModuleStatus.Stopping, "停止中"],
    [ModuleStatus.StartError, "启动错误"],
    [ModuleStatus.RunError, "运行错误"],
    [ModuleStatus.StopError, "停止错误"],
]);
