import React, { useState } from "react";
import { Project } from "@zeplin/sdk";
import Header from "./Header";

const MAX_FILTERED_PROJECTS = 20;
const PLATFORM_DESCRIPTIONS = {
    web: "Web",
    ios: "iOS",
    android: "Android",
    macos: "macOS",
};

function Projects(props: {
    projects: Project[] | undefined;
    query: string;
    onSelect: (project: Project) => void;
    onQueryChange: (query: string) => void;
}) {
    const [query, setQuery] = useState(props.query);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.trim();

        setQuery(event.target.value.trim());
        props.onQueryChange(query);
    };

    let element = () => {
        if (!props.projects) {
            return <p className="secondary">Fetching projects…</p>;
        }

        if (query.length < 3) {
            return;
        }

        const filteredProjects = props.projects
            .filter((project) =>
                project.name.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, MAX_FILTERED_PROJECTS);

        if (!filteredProjects.length) {
            return <p className="secondary">No such project</p>;
        }

        return (
            <ul>
                {filteredProjects.map((project) => (
                    <li key={project.id}>
                        <button onClick={() => props.onSelect(project)}>
                            {project.name}
                        </button>
                        <span className="secondary">
                            , {PLATFORM_DESCRIPTIONS[project.platform]}
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            <Header>Select project</Header>
            <input
                type="text"
                id="projectName"
                value={query}
                placeholder="Type project name"
                autoComplete="off"
                autoFocus
                onChange={handleInputChange}
            ></input>
            {element()}
        </>
    );
}

export default Projects;
