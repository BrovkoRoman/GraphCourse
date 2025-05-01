import React from 'react'

export class FordBellman extends React.Component {
    render() {
        return (<div>
                    <input id="fordBellmanVertex"/> <button onClick={this.props.onClick}>
                                                        Запустить алгоритм Форда-Беллмана
                                                    </button>
                </div>);
    }
}