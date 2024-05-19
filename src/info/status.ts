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
    StopError = 7
}


export const statusLabel: Map<ModuleStatus, string> = new Map([
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

