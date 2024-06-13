export enum DockerStatus {
    NotLoaded = 0,
    NotCreated = 1,
    Running = 2,
    Exited = 3,
    Handling = 4,
}

export const dockerStatusLabel: Map<DockerStatus, string> = new Map([
    [DockerStatus.NotLoaded, "未加载"],
    [DockerStatus.Exited, "停止中"],
    [DockerStatus.NotCreated, "停止中"],
    [DockerStatus.Running, "运行中"],
    [DockerStatus.Handling, "处理中"],
]);

export interface DockerInfo {
    name: string;
    image: string;
    moduleName: string;
    moduleKind: string;
    status: DockerStatus;
}
