import { ZeplinApi, Configuration } from "@zeplin/sdk";

const ACCESS_TOKEN_LOCAL_STORAGE_KEY = "accessToken";

const zeplin = {
    api: (): ZeplinApi => {
        let configuration;
        const accessToken = localStorage.getItem(
            ACCESS_TOKEN_LOCAL_STORAGE_KEY
        );
        if (accessToken) {
            configuration = new Configuration({ accessToken });
        }

        return new ZeplinApi(configuration);
    },
    authenticate: (accessToken: string) => {
        localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, accessToken);
    },
    isAuthenticated: (): boolean => {
        return Boolean(localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY));
    },
};

export default zeplin;
