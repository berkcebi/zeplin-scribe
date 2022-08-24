import React, { useState, useEffect } from "react";
import { Project, ProjectStatusEnum } from "@zeplin/sdk";
import Header from "./Header";
import zeplin from "./zeplin";

const LIMIT = 100;

function SelectProject() {
    const [projects, setProjects] = useState<Project[] | undefined>(undefined);

    useEffect(() => {
        let didCancel = false;

        (async () => {
            const projects: Project[] = [];
            let fetchNextPage = true;
            while (!didCancel && fetchNextPage) {
                const response = await zeplin.projects.getProjects({
                    status: ProjectStatusEnum.ACTIVE,
                    limit: LIMIT,
                    offset: projects.length,
                });

                const responseProjects = response.data;
                projects.push(...responseProjects);

                if (responseProjects.length < LIMIT) {
                    fetchNextPage = false;
                }
            }

            if (!didCancel) {
                setProjects(projects);
            }
        })();

        return () => {
            didCancel = true;
        };
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(
            `Changed text input to ${JSON.stringify(event.target.value)}.`
        );
    };

    return (
        <div>
            <Header onBack={() => console.log("Back button clicked.")}>
                Select project
            </Header>
            <input
                type="text"
                id="projectName"
                placeholder="Type project name"
                autoFocus
                onChange={handleInputChange}
            ></input>
            {projects ? (
                <p>{projects.length} projects</p>
            ) : (
                <p>Fetching projects…</p>
            )}
        </div>
    );
}

export default SelectProject;
