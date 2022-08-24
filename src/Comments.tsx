import React from "react";
import { Project } from "@zeplin/sdk";
import Header from "./Header";

function Comments(props: { project: Project; onBack: () => void }) {
    return (
        <div>
            <Header onBack={props.onBack}>
                <span className="secondary">Comments in</span>{" "}
                {props.project.name}
            </Header>
        </div>
    );
}

export default Comments;
