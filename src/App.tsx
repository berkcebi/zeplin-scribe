import React, { useState, useEffect } from "react";
import { Project, ProjectStatusEnum } from "@zeplin/sdk";
import Comments from "./Comments";
import Projects from "./Projects";
import zeplin from "./zeplin";

const REQUEST_LIMIT = 100;

function App() {
    const [projects, setProjects] = useState<Project[] | undefined>(undefined);
    const [projectQuery, setProjectQuery] = useState("");
    const [selectedProject, setSelectedProject] = useState<Project | undefined>(
        undefined
    );

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

    const handleBack = () => {
        setSelectedProject(undefined);
    };

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
    };

    const handleProjectQueryChange = (projectQuery: string) => {
        setProjectQuery(projectQuery);
    };

    // TODO: Support browser back/forward buttons.
    return selectedProject ? (
        <Comments project={selectedProject} onBack={handleBack} />
    ) : (
        <Projects
            projects={projects}
            query={projectQuery}
            onSelect={handleSelectProject}
            onQueryChange={handleProjectQueryChange}
        />
    );
}

export default App;
