import axios from "axios";
import { getApiUrl, postRequest } from "./utils";

// const BOOTER = "booter";

function getModuleApiUrl(name: string) {
    return getApiUrl("interact/" + name);
}

export const interactApi = {
    endMessage(content: string) {
        const request = postRequest(getModuleApiUrl("message"), {
            content,
        });

        axios(request);
    },
};
