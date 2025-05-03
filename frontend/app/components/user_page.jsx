import React from 'react'
import {getCookieValue} from "../utils/getCookie.js"

export class UserPage extends React.Component {
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
                                   </span>
                </div>);
    }
}