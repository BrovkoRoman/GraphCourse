import React from 'react'

export class Kruskal extends React.Component {
    render() {
        return (<div>
                    <button onClick={this.props.onClick}>
                        Запустить алгоритм Краскала
                    </button>
                </div>);
    }
}