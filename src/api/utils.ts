import axios, { AxiosRequestConfig } from "axios";

export function postRequest(apiUrl: string, data: any): AxiosRequestConfig {
    return {
        method: "post",
        url: apiUrl,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };
}

export function deleteRequest(apiUrl: string, data: any) {
    return axios({
        method: "delete",
        url: apiUrl,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    });
}

export function putRequest(apiUrl: string, data: any) {
    return axios({
        method: "put",
        url: apiUrl,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    });
}

export function getRequest(apiUrl: string, params: any): AxiosRequestConfig {
    return {
        method: "get",
        url: apiUrl,
        params: params,
        headers: {
            "Content-Type": "application/json",
        },
    };
}

export function getApiUrl(name: string) {
    var apiUrl = "/api/" + name;
    return apiUrl;
}

export function blob2Url(data: any, type: string) {
    return window.URL.createObjectURL(new Blob([data], { type: type }));
}
