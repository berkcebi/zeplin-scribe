import { Project } from "@zeplin/sdk";
import SelectProject from "./SelectProject";

function App() {
    const handleSelectProject = (project: Project) => {
        console.log(`Selected project ${project.name}.`);
    };

    return <SelectProject onSelect={handleSelectProject} />;
}

export default App;
