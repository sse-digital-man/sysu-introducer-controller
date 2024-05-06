import axios from "axios";
import { getApiUrl, getRequest, postRequest, putRequest } from "./utils";
import { ModuleStatus } from "../info/status";

const BOOTER = "booter";

function getModuleApiUrl(name: string) {
    return getApiUrl("module/" + name);
}

export const moduleControlApi = {
    startModule(name: string) {
        let request = postRequest(getModuleApiUrl(`start/${name}`), undefined);
        axios(request);
    },
    stopModule(name: string) {
        let request = postRequest(getModuleApiUrl(`stop/${name}`), undefined);
        axios(request);
    },
    async getModuleStatus(name: string) {
        let request = getRequest(getModuleApiUrl(`status/${name}`), undefined);

        return await axios(request)
            .then((resp) => {
                return resp.data;
            })
            .catch(() => {
                return {
                    info: {
                        status: ModuleStatus.NotConnected,
                    },
                };
            });
    },

    // BOOTER 代表整个数字人系统，以下 API 用于整体控制
    boot() {
        this.startModule(BOOTER);
    },
    shutDown() {
        this.stopModule(BOOTER);
    },
    async getStatus() {
        return await this.getModuleStatus(BOOTER);
    },

    async getControllableModuleList(with_booter: boolean = false) {
        let request = getRequest(getModuleApiUrl(`list/controllable`), {
            with_booter,
        });

        return await axios(request).then((resp) => {
            return resp.data;
        });
    },

    async getAllModuleList() {
        let request = getRequest(getModuleApiUrl(`list/all`), undefined);

        return await axios(request).then((resp) => {
            return resp.data;
        });
    },

    async getModuleConfig(name: string) {
        let request = getRequest(getModuleApiUrl(`config/${name}`), undefined);

        return await axios(request)
            .then((resp) => {
                return resp.data;
            })
            .catch(() => {
                return undefined;
            });
    },

    updateModuleConfig(name: string, kind: string, content: any) {
        let request = putRequest(getModuleApiUrl(`config/${name}`), {
            kind: kind,
            content: content,
        });

        axios(request);
    },
};
