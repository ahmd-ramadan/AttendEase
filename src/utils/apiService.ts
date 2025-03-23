
import axiosInstance from "./axiosInstance";
import { ErrorResponse, handleError } from "./errorHandler";

export type ResponseTypes<T> = Promise<ApiResponse<T> | ErrorResponse | undefined>;

export interface ApiResponse<T> {
    success: boolean;
    msg: string;
    data: T;
}

interface RequestParams {
    endpoint: string;
    data?: any;
    token?: string;
    formData?: boolean;
}

const setHeaders = (token?: string, formData?: boolean): { [key: string]: string } => {
    let headers: { [key: string]: string } = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (formData) {
        headers['Content-Type'] = 'multipart/form-data';
    }

    return headers;
};

export const postData = async <T>({
    endpoint,
    data,
    token,
    formData
}: RequestParams): Promise<ApiResponse<T> | ErrorResponse | undefined> => {
    try {
        const response = await axiosInstance.post<ApiResponse<T>>(endpoint, data, { headers: setHeaders(token, formData) });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const getData = async <T>({
    endpoint,
    token
}: RequestParams): Promise<ApiResponse<T> | ErrorResponse | undefined> => {
    try {
        const response = await axiosInstance.get<ApiResponse<T>>(endpoint, { headers: setHeaders(token) });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const putData = async <T>({
    endpoint,
    data,
    token,
    formData
}: RequestParams): Promise<ApiResponse<T> | ErrorResponse | undefined> => {
    try {
        const response = await axiosInstance.put<ApiResponse<T>>(endpoint, data, { headers: setHeaders(token, formData) });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const deleteData = async <T>({
    endpoint,
    token
}: RequestParams): Promise<ApiResponse<T> | ErrorResponse | undefined> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<T>>(endpoint, { headers: setHeaders(token) });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const patchData = async <T>({
    endpoint,
    data,
    token,
    formData
}: RequestParams): Promise<ApiResponse<T> | ErrorResponse | undefined> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<T>>(endpoint, data, { headers: setHeaders(token, formData) });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};