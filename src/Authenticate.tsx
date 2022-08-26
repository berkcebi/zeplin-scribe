import React, { useState } from "react";
import Header from "./Header";
import zeplin from "./zeplin";

// TODO: Handle missing environment variables.
const CLIENT_ID = process.env.REACT_APP_ZEPLIN_CLIENT_ID || "";
const REDIRECT_URI = process.env.REACT_APP_ZEPLIN_REDIRECT_URI || "";

function Authenticate() {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);

        // TODO: Handle error.
        const url = await zeplin.api().authorization.getAuthorizationUrl({
            clientId: CLIENT_ID,
            redirectUri: REDIRECT_URI,
        });

        window.location.replace(url);
    };

    return (
        <>
            <Header>Zeplin Scribe</Header>
            <p className="secondary">
                <button disabled={isLoading} onClick={handleClick}>
                    Connect Zeplin account
                </button>{" "}
                to list all open comments in your projects
            </p>
        </>
    );
}

export default Authenticate;
