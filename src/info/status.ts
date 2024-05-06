export const statusLabel: string[] = ["", "未运行", "启动中", "运行中", "停止中"];

export enum ModuleStatus {
    Stopped = 1,
    Starting = 2,
    Started = 3,
    Stopping = 4,
}
