import React, { useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import zeplin from "./zeplin";

// TODO: Handle missing environment variables.
const CLIENT_ID = process.env.REACT_APP_ZEPLIN_CLIENT_ID || "";
const CLIENT_SECRET = process.env.REACT_APP_ZEPLIN_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.REACT_APP_ZEPLIN_REDIRECT_URI || "";

function Authorize() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // Ensure authorization request is sent only once in strict mode.
    const isAuthorizing = useRef(false);

    useEffect(() => {
        if (isAuthorizing.current) {
            return;
        }
        isAuthorizing.current = true;

        const authorizationCode = searchParams.get("code") || "";

        (async () => {
            // TODO: Handle error.
            const response = await zeplin.api().authorization.createToken({
                code: authorizationCode,
                clientId: CLIENT_ID,
                redirectUri: REDIRECT_URI,
                clientSecret: CLIENT_SECRET,
            });

            const accessToken = response.data.accessToken;
            zeplin.authenticate(accessToken);

            navigate("/");
        })();
    }, [searchParams, navigate]);

    return <p className="secondary">Tickling Zeplin…</p>;
}

export default Authorize;
