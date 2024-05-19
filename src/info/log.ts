export enum ModuleLogKind {
    Status = 1,
    Message = 2,
    Handle = 3
}

export const moduleLogKindLabelMap: Map<ModuleLogKind, string> = new Map([
    [ModuleLogKind.Status, "模块状态"],
    [ModuleLogKind.Message, "消息交互"],
    [ModuleLogKind.Handle, "模块处理"],
]);