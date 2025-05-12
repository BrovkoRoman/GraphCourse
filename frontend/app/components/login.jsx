import React from "react";
import {getCookieValue} from "../utils/getCookie.js";
import {baseUrl} from "../app.jsx";

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.buttonClick = this.buttonClick.bind(this);
    }

    buttonClick() {
        const loginValue = document
        .getElementById("username").value;

        fetch(baseUrl + 'loginPage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                login: loginValue,
                password: document
                .getElementById("password").value
              })
            })
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              throw new Error('Something went wrong');
            })
            .then((result) => {
              document.cookie = "login=" + loginValue;
              document.cookie = "jwt=" + result.jwt;
              document.cookie = "role=" + result.role;
              this.props.toHome();
            })
            .catch((error) => {
              alert("Неверное имя пользователя или пароль");
            });
    }

    render() {
        return (<div className="login">
                    <input type="text" id="username"
                    name="username" placeholder="Логин" /><br />

                    <input type="password" id="password" name="password" className="mt5"
                    placeholder="Пароль" /><br />

                    <button type="button" onClick={this.buttonClick} className="mt10"
                    id="regButton">Войти</button>
                </div>
        );
    }
}
