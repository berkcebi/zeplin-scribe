import React, { useState, useEffect, useRef } from "react";
import { Project, ProjectStatusEnum } from "@zeplin/sdk";
import Header from "./Header";
import zeplin from "./zeplin";

const REQUEST_LIMIT = 100;
const MAX_FILTERED_PROJECTS = 20;

function SelectProject() {
    const [projects, setProjects] = useState<Project[] | undefined>(undefined);
    const [filteredProjects, setFilteredProjects] = useState<
        Project[] | undefined
    >(undefined);
    const keyword = useRef("");

    useEffect(() => {
        let didCancel = false;

        (async () => {
            const projects: Project[] = [];
            let fetchNextPage = true;
            while (!didCancel && fetchNextPage) {
                const response = await zeplin.projects.getProjects({
                    status: ProjectStatusEnum.ACTIVE,
                    limit: REQUEST_LIMIT,
                    offset: projects.length,
                });

                const responseProjects = response.data;
                projects.push(...responseProjects);

                if (responseProjects.length < REQUEST_LIMIT) {
                    fetchNextPage = false;
                }
            }

            if (!didCancel) {
                setProjects(projects);
                filterProjects(projects);
            }
        })();

        return () => {
            didCancel = true;
        };
    }, []);

    function filterProjects(projects: Project[] | undefined) {
        if (!projects || keyword.current.length < 3) {
            setFilteredProjects(undefined);
            return;
        }

        const filteredProjects = projects
            .filter((project) =>
                project.name
                    .toLowerCase()
                    .includes(keyword.current.toLowerCase())
            )
            .slice(0, MAX_FILTERED_PROJECTS);
        setFilteredProjects(filteredProjects);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        keyword.current = event.target.value.trim();
        filterProjects(projects);
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
                filteredProjects &&
                (filteredProjects.length ? (
                    <ul>
                        {filteredProjects.map((project) => (
                            <li key={project.id}>
                                {project.name}, {project.platform}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No such project</p>
                ))
            ) : (
                <p>Fetching projects…</p>
            )}
        </div>
    );
}

export default SelectProject;
