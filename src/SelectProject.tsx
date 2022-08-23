import React from "react";
import Header from "./Header";

class SelectProject extends React.Component {
    render() {
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
                    onChange={this.handleInputChange}
                ></input>
            </div>
        );
    }

    componentDidMount() {
        console.log("Component did mount.");
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(this);
        console.log(
            `Changed text input to ${JSON.stringify(event.target.value)}.`
        );
    };
}

export default SelectProject;
