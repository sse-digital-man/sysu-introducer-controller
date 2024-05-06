import axios from "axios";
import { getApiUrl, getRequest, postRequest } from "./utils";

const BOOTER = "booter";

export const moduleControlApi = {
    startModule(name: string) {
        let request = postRequest(getApiUrl(`module/${name}/start`), undefined);
        axios(request);
    },
    stopModule(name: string) {
        let request = postRequest(getApiUrl(`module/${name}/stop`), undefined);
        axios(request);
    },
    async getModuleStatus(name: string) {
        let request = getRequest(getApiUrl(`module/${name}/status`), undefined);

        return await axios(request).then((resp) => {
            return resp.data;
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
};
