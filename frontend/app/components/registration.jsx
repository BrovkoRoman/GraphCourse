import React from 'react'
import {getCookieValue} from "../utils/getCookie.js";
import {baseUrl} from "../app.jsx";


export class Registration extends React.Component {

    constructor(props) {
        super(props);

        this.changePassword = this.changePassword.bind(this);
        this.changeLogin = this.changeLogin.bind(this);
        this.checkPasswordConfirmation =
            this.checkPasswordConfirmation.bind(this);
        this.buttonClick = this.buttonClick.bind(this);
    }
    checkDataValidity() {
        const incorrectLogin = document
        .getElementById("incorrectLogin")
        const incorrectPassword = document
        .getElementById("incorrectPassword");
        const incorrectConfirm = document
        .getElementById("incorrectConfirm");
        const loginInput = document
        .getElementById("username");
        const passwordInput = document
        .getElementById("password");
        const confirmPassword = document
        .getElementById("confirmPassword");

        return (loginInput.value !== "" && passwordInput.value !== ""
        && confirmPassword.value !== "" && incorrectLogin.hidden
        && incorrectPassword.hasAttribute("hidden")
        && incorrectConfirm.hasAttribute("hidden"));
    }
    changeLogin() {
        const incorrectLogin = document
        .getElementById("incorrectLogin");
        const loginInput = document.getElementById("username");
        const len = loginInput.value.length;

        if(len < 3 || len > 20) {
            incorrectLogin.removeAttribute("hidden");
        } else {
            incorrectLogin.setAttribute("hidden", "");
        }
    }
    checkPasswordConfirmation() {
        const passwordInput = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmPassword");
        const incorrectConfirm = document
        .getElementById("incorrectConfirm");

        if(passwordInput.value ===
            confirmPassword.value) {
            incorrectConfirm.setAttribute("hidden", "");
        } else {
            incorrectConfirm.removeAttribute("hidden");
        }
    }
    changePassword() {
        const incorrectPassword = document
        .getElementById("incorrectPassword");
        const passwordInput = document.getElementById("password");
        const len = passwordInput.value.length;

        if(len < 8) {
            incorrectPassword.removeAttribute("hidden");
        } else {
            incorrectPassword.setAttribute("hidden", "");
        }

        this.checkPasswordConfirmation();
    }
    buttonClick() {
        const loginValue = document
        .getElementById("username").value;
        if(!this.checkDataValidity()) {
            alert("Data is invalid");
            return;
        }
        fetch(baseUrl + 'new-user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
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
              .then(result => {
                document.cookie = "login=" + loginValue;
                document.cookie = "jwt=" + result.jwt;
                document.cookie = "role=" + result.role;
                alert("Successful registration\nCurrent login: "
                + getCookieValue("login"));
              })
              .catch((error) => {
                alert("This user already exists\nCurrent login: "
                + getCookieValue("login"));
              });
    }
    render() {
        return (<div>
                    <input type="text" id="username"
                    placeholder="Логин"
                    onChange={this.changeLogin}/><br />

                    <div id="incorrectLogin" className="errorText"
                    hidden>Логин должен быть от 3 до 20 символов</div>

                    <input type="password" id="password"
                    onChange={this.changePassword} placeholder="Пароль" />
                    <br />

                    <div id="incorrectPassword" className="errorText"
                    hidden>Пароль должен быть от 8 символов</div>

                    <input type="password" id="confirmPassword"
                    onChange={this.checkPasswordConfirmation}
                    placeholder="Подтверждение пароля" /><br />

                    <div id="incorrectConfirm" className="errorText"
                    hidden>Пароли не совпадают</div>

                    <button type="button" onClick={this.buttonClick}
                    id="regButton">Зарегистрироваться</button>
                </div>
        );
    }
}