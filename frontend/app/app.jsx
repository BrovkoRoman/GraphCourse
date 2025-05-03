import ReactDOM from "react-dom/client"
import React from "react"
import {Header} from "./components/header.jsx"
import {Home} from "./components/home.jsx"
import {Login} from "./components/login.jsx"
import {Registration} from "./components/registration.jsx"
import {Task} from "./components/task.jsx"
import {Test} from "./components/test.jsx"
import {Visualization} from "./components/visualization.jsx"
import {UserPage} from "./components/user_page.jsx"
import {getCookieValue} from "./utils/getCookie.js"
import {deleteCookie} from "./utils/deleteCookie.js"

export const baseUrl = "http://localhost:8080/";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = JSON.parse(localStorage.getItem("state")) || {
            page: "Visualization"
        };
        this.onClickHome = this.onClickHome.bind(this)
        this.onClickLogin = this.onClickLogin.bind(this)
        this.onClickRegistration = this.onClickRegistration.bind(this)
        this.onClickTask = this.onClickTask.bind(this)
        this.onClickTest = this.onClickTest.bind(this)
        this.onClickVisualization = this.onClickVisualization.bind(this)
        this.onClickLogout = this.onClickLogout.bind(this)
        this.onClickUserPage = this.onClickUserPage.bind(this)
    }
    render() {
        return (<div>
                   <Header curPage={this.state.page}
                           onClickHome={this.onClickHome}
                           onClickLogin={this.onClickLogin}
                           onClickRegistration={this.onClickRegistration}
                           onClickVisualization={this.onClickVisualization}
                           onClickLogout={this.onClickLogout}
                           onClickUserPage={this.onClickUserPage}
                           />
                   {this.renderContent()}
               </div>)
    }

    renderContent() {
        if(this.state.page === "Home") {
            return <Home onClickTask={this.onClickTask} onClickTest={this.onClickTest}/>
        } else if(this.state.page === "Login") {
            return <Login toHome={this.onClickHome}/>
        } else if(this.state.page === "Registration") {
            return <Registration toHome={this.onClickHome}/>
        } else if(this.state.page === "Task") {
            return <Task task={this.state.task} />
        } else if(this.state.page === "Test") {
            return <Test test={this.state.test} toHome={this.onClickHome}/>
        } else if(this.state.page === "Visualization") {
            return <Visualization />
        } else if(this.state.page === "UserPage") {
            return <UserPage />
        }
    }

    setStateInLocalStorage(state) {
        localStorage.setItem('state', JSON.stringify(state));
    }

    onClickHome() {
        this.setState({page: "Home"},
        this.setStateInLocalStorage({page: "Home"}));
    }

    onClickLogin() {
        this.setState({page: "Login"},
        this.setStateInLocalStorage({page: "Login"}));
    }

    onClickRegistration() {
        this.setState({page: "Registration"},
        this.setStateInLocalStorage({page: "Registration"}));
    }

    onClickUserPage() {
        this.setState({page: "UserPage"},
        this.setStateInLocalStorage({page: "UserPage"}));
    }

    onClickLogout() {
        deleteCookie("jwt");
        deleteCookie("login");
        deleteCookie("role");
        this.onClickLogin();
    }

    onClickTask(task) {
        this.setState({
            page: "Task",
            task: task
        },
        this.setStateInLocalStorage({
            page: "Task",
            task: task
        }));
    }

    onClickTest(test) {
        this.setState({
            page: "Test",
            test: test
        },
        this.setStateInLocalStorage({
            page: "Test",
            test: test
        }));
    }

    onClickVisualization() {
        this.setState({
            page: "Visualization"
        },
        this.setStateInLocalStorage({page: "Visualization"}));
    }
}

ReactDOM.createRoot(
    document.getElementById("app")
)
.render(
    <App />
);
