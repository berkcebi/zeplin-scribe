import { Project } from "@zeplin/sdk";
import Projects from "./Projects";

function App() {
    const handleSelectProject = (project: Project) => {
        console.log(`Selected project ${project.name}.`);
    };

    return <Projects onSelect={handleSelectProject} />;
}

export default App;
