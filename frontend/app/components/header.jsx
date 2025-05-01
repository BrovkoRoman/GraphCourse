import React from 'react'

export class Header extends React.Component {
    render() {
        return (<header>
                    <h1>
                         <div>
                             <a onClick={this.props.onClickHome}> Главная </a> &nbsp;
                             <a onClick={this.props.onClickVisualization}> Визуализация </a> &nbsp;
                             <a onClick={this.props.onClickLogin}> Войти&nbsp;&nbsp; </a>
                             <a onClick={this.props.onClickRegistration}> Зарегистрироваться </a> &nbsp;
                         </div>
                     </h1>
                </header>);
    }
}