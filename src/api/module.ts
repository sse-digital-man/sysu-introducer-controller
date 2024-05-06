import axios from "axios";
import { getApiUrl, postRequest } from "./utils";

export const startModule = (name: string) => {
    let request = postRequest(getApiUrl(`module/${name}/start`), undefined);
    axios(request);
};

export const stopModule = (name: string) => {
    let request = postRequest(getApiUrl(`module/${name}/stop`), undefined);
    axios(request);
};
