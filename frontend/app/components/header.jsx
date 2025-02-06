import React from 'react'

export class Header extends React.Component {
    render() {
        return (<header>
                    <h1>
                         <div>
                             <a onClick={this.props.onClickHome}> Home </a>
                             <a onClick={this.props.onClickLogin}> Login </a>
                             <a onClick={this.props.onClickRegistration}> Register </a>
                         </div>
                     </h1>
                </header>);
    }
}