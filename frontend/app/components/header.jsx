import React from 'react'
import {getCookieValue} from "../utils/getCookie.js"

export class Header extends React.Component {
    render() {
        const isLoggedIn = !!getCookieValue("login");
        return (<header className="header">
                    <h1>
                         <div>
                             <div className="half">
                                 {!isLoggedIn ? null: this.props.curPage === "Home" ?
                                    (<span className="curPage">&nbsp;Главная&nbsp;&nbsp;</span>) :
                                 (<a className="blackLink" onClick={this.props.onClickHome}>&nbsp;Главная&nbsp;&nbsp;</a>)}
                                 {this.props.curPage === "Visualization" ?
                                 (<span className="curPage ml20">Визуализация&nbsp;</span>) :
                                 (<a className="blackLink ml20"
                                 onClick={this.props.onClickVisualization}>Визуализация&nbsp;</a>)}&nbsp;
                             </div>
                             <div className="right half">
                                 {isLoggedIn ? (<a className="blackLink right ml20"
                                                 onClick={this.props.onClickLogout}>Выйти&nbsp;&nbsp;</a>)
                                              : null}
                                 {!isLoggedIn ? null :
                                     this.props.curPage === "UserPage" ?
                                         (<span className="curPage right">&nbsp;{getCookieValue("login")}&nbsp;&nbsp;</span>) :
                                         (<a className="blackLink right"
                                                  onClick={this.props.onClickUserPage}> {getCookieValue("login")}&nbsp;&nbsp;</a>)}
                                 {isLoggedIn ? null: this.props.curPage === "Registration" ?
                                     (<span className="curPage right ml20"> Зарегистрироваться &nbsp;</span>) :
                                     (<a className="blackLink right ml20"
                                         onClick={this.props.onClickRegistration}> Зарегистрироваться &nbsp;</a>)}
                                 {isLoggedIn ? null: this.props.curPage === "Login" ?
                                                (<span className="curPage right"> Войти &nbsp;</span>) :
                                 (<a className="blackLink right" onClick={this.props.onClickLogin}> Войти &nbsp;</a>)}
                            </div>

                         </div>
                     </h1>
                     <hr className="hr"/>
                </header>);
    }
}