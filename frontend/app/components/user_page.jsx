import React from 'react'
import {getCookieValue} from "../utils/getCookie.js"

export class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scores: 0, // total score of current student or array of scores of all students if current user is a teacher
            totalScore: 0 // maximum possible score
        };
    }
    makeTeacher() {
        const makeTeacherInput = document.getElementById("makeTeacher");
        if(makeTeacherInput.value === "") {
            alert("Поле должно быть непустым");
            return;
        }
        fetch("http://localhost:8080/make-teacher",
        {
            headers: {
              'Content-Type': 'plain/text'
            },
            method: "PUT",
            credentials: 'include',
            body: makeTeacherInput.value
        })
        .then(response => response.text())
        .then(result => {
            alert(result);
        })
    }
    render() {
        const isLoggedIn = !!getCookieValue("login");
        if(!isLoggedIn) {
            return null;
        }
        return (<div className="userPage">
                    Пользователь: <span className="userInfo">{getCookieValue("login")}</span><br/>
                    Текущая роль: <span className="userInfo">
                                    {getCookieValue("role") === "TEACHER" ? "преподаватель"
                                    : getCookieValue("role") === "STUDENT" ? "студент"
                                    : getCookieValue("role")}
                                   </span><br/>
                    {getCookieValue("role") === "STUDENT" ?
                        (<span>Баллы: {this.state.scores.toFixed(2)}/{this.state.totalScore.toFixed(2)}</span>) :
                     getCookieValue("role") === "TEACHER" && !!this.state.scores ?
                        (<div>
                            <details>
                                <summary className="home-advanced-button">
                                    Сделать другого пользователя преподавателем</summary>
                                <input id="makeTeacher" placeholder="пользователь"/>
                                <button onClick={this.makeTeacher} className="ml20">Отправить</button><br/>
                            </details>
                            <br/>
                            Баллы студентов:<br/>
                            {this.state.scores.map(studentScore => (
                                <div className="content">{studentScore.login}: {studentScore.score.toFixed(2)}
                                /{this.state.totalScore.toFixed(2)}</div>
                            ))}
                         </div>) : null
                    }
                </div>);
    }
    componentDidMount() {
        if(getCookieValue("role") === "STUDENT") {
            fetch("http://localhost:8080/student-score",
            {
                credentials: 'include'
            })
            .then(response => response.json())
            .then(score => {
                this.setState({scores: score});
            });
        } else if(getCookieValue("role") === "TEACHER") {
            fetch("http://localhost:8080/student-score-list",
            {
                credentials: 'include'
            })
            .then(response => response.json())
            .then(scoreList => {
                this.setState({scores: scoreList});
            })
        }
        fetch("http://localhost:8080/total-max-score")
        .then(response => response.json())
        .then(score => {
            this.setState({totalScore: score});
        });
    }
}