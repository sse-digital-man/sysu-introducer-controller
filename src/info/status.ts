export const statusLabel: string[] = ["未加载", "未运行", "启动中", "运行中", "停止中", "未连接"];

export enum ModuleStatus {
    NotConnected = 5,
    NotLoaded = 0,
    Stopped = 1,
    Starting = 2,
    Started = 3,
    Stopping = 4,
}
