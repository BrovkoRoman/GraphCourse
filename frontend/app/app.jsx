import ReactDOM from "react-dom/client"
import React from "react"
import {Header} from "./components/header.jsx"
import {Article} from "./components/article.jsx"
import {Home} from "./components/home.jsx"
import {Login} from "./components/login.jsx"
import {Registration} from "./components/registration.jsx"
import {Task} from "./components/task.jsx"
import {getCookieValue} from "./utils/getCookie.js"

export const baseUrl = "http://localhost:8080/";
const header = "Рассказ";
const article = "После одного из заседаний N-ского мирового съезда судьи собрались в совещательной комнате, чтобы снять свои мундиры, минутку отдохнуть и ехать домой обедать.";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: "Home"
        }
        this.onClickHome = this.onClickHome.bind(this)
        this.onClickLogin = this.onClickLogin.bind(this)
        this.onClickRegistration = this.onClickRegistration.bind(this)
        this.onClickTask = this.onClickTask.bind(this)
    }
    render() {
        return (<div>
                   <Header text={header} onClickHome={this.onClickHome}
                                         onClickLogin={this.onClickLogin}
                                         onClickRegistration={this.onClickRegistration}/>
                   <Article content={article} />
                   {this.renderContent()}
               </div>)
    }

    renderContent() {
        if(this.state.page === "Home") {
            return <Home onClickTask={this.onClickTask}/>
        } else if(this.state.page === "Login") {
            return <Login />
        } else if(this.state.page === "Registration") {
            return <Registration />
        } else if(this.state.page === "Task") {
            return <Task task={this.state.task} />
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
}

ReactDOM.createRoot(
    document.getElementById("app")
)
.render(
    <App />
);
