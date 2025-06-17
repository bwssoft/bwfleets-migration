import { AxiosRequestConfig } from "axios";

export interface Method {
  GET: {
    url: string;
    config?: AxiosRequestConfig;
    data: object;
    responseType?:
      | "arraybuffer"
      | "blob"
      | "document"
      | "json"
      | "text"
      | "stream"
      | undefined;
  };
  DELETE: {
    url: string;
    config?: AxiosRequestConfig;
    data: object;
  };
  POST: {
    url: string;
    data?: object;
    config?: AxiosRequestConfig;
  };
  PUT: {
    url: string;
    data?: object;
    config?: AxiosRequestConfig;
  };
  PATCH: {
    url: string;
    data?: object;
    config?: AxiosRequestConfig;
  };
}

export interface IServiceHookHelperResponse<T> {
  isError: boolean;
  error?: Array<{
    context: string;
    message: string;
    path: string;
  }>;
  data: T;
  status?: number;
}

export interface IServiceHookHelper {
  serviceHookHelper: <K extends keyof Method>(
    key: K
  ) => <R>(request: Method[K]) => Promise<IServiceHookHelperResponse<R>>;
}
