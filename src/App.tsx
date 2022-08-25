import React, { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Project, ProjectStatusEnum } from "@zeplin/sdk";
import Comments from "./Comments";
import Projects from "./Projects";
import zeplin from "./zeplin";

const REQUEST_LIMIT = 100;

function App() {
    const [projects, setProjects] = useState<Project[] | undefined>(undefined);
    const projectQuery = useRef("");

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
            }
        })();

        return () => {
            didCancel = true;
        };
    }, []);

    const handleProjectQueryChange = (query: string) => {
        projectQuery.current = query;
    };

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Projects
                        projects={projects}
                        query={projectQuery.current}
                        onQueryChange={handleProjectQueryChange}
                    />
                }
            />
            <Route
                path="/:projectId"
                element={<Comments projects={projects} />}
            />
        </Routes>
    );
}

export default App;
