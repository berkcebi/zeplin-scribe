import React, { useState } from "react";
import { Project } from "@zeplin/sdk";
import Comments from "./Comments";
import Projects from "./Projects";

function App() {
    const [selectedProject, setSelectedProject] = useState<Project | undefined>(
        undefined
    );

    const handleBack = () => {
        setSelectedProject(undefined);
    };

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
    };

    return selectedProject ? (
        <Comments project={selectedProject} onBack={handleBack} />
    ) : (
        <Projects onSelect={handleSelectProject} />
    );
}

export default App;
