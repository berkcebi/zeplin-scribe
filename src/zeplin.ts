import { ZeplinApi, Configuration } from "@zeplin/sdk";

const zeplin = new ZeplinApi(
    new Configuration({
        accessToken: process.env.REACT_APP_ZEPLIN_ACCESS_TOKEN,
    })
);

export default zeplin;
