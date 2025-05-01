import ReactDOM from "react-dom/client"
import React from "react"
import {Header} from "./components/header.jsx"
import {Home} from "./components/home.jsx"
import {Login} from "./components/login.jsx"
import {Registration} from "./components/registration.jsx"
import {Task} from "./components/task.jsx"
import {Test} from "./components/test.jsx"
import {Visualization} from "./components/visualization.jsx"
import {getCookieValue} from "./utils/getCookie.js"

export const baseUrl = "http://localhost:8080/";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: "Visualization"
        }
        this.onClickHome = this.onClickHome.bind(this)
        this.onClickLogin = this.onClickLogin.bind(this)
        this.onClickRegistration = this.onClickRegistration.bind(this)
        this.onClickTask = this.onClickTask.bind(this)
        this.onClickTest = this.onClickTest.bind(this)
        this.onClickVisualization = this.onClickVisualization.bind(this)
    }
    render() {
        return (<div>
                   <Header onClickHome={this.onClickHome}
                                         onClickLogin={this.onClickLogin}
                                         onClickRegistration={this.onClickRegistration}
                                         onClickVisualization={this.onClickVisualization}/>
                   {this.renderContent()}
               </div>)
    }

    renderContent() {
        if(this.state.page === "Home") {
            return <Home onClickTask={this.onClickTask} onClickTest={this.onClickTest}/>
        } else if(this.state.page === "Login") {
            return <Login />
        } else if(this.state.page === "Registration") {
            return <Registration />
        } else if(this.state.page === "Task") {
            return <Task task={this.state.task} />
        } else if(this.state.page === "Test") {
            return <Test test={this.state.test} toHome={this.onClickHome}/>
        } else if(this.state.page === "Visualization") {
            return <Visualization />
        }
    }

    onClickHome() {
        this.setState({page: "Home"})
    }

    onClickLogin() {
        this.setState({page: "Login"})
    }

    onClickRegistration() {
        this.setState({page: "Registration"})
    }

    onClickTask(task) {
        this.setState({
            page: "Task",
            task: task
        });
    }

    onClickTest(test) {
        this.setState({
            page: "Test",
            test: test
        })
    }

    onClickVisualization() {
        this.setState({
            page: "Visualization"
        })
    }
}

ReactDOM.createRoot(
    document.getElementById("app")
)
.render(
    <App />
);
