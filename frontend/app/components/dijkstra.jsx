import React from 'react'

export class Dijkstra extends React.Component {
    render() {
        return (<div>
                    <input id="dijkstraVertex"/> <button onClick={this.props.onClick}>Запустить алгоритм Дейкстры</button>
                </div>);
    }
}