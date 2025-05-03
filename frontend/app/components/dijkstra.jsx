import React from 'react'

export class Dijkstra extends React.Component {
    render() {
        return (<div>
                    <input id="dijkstraVertex"
                    placeholder="вершина"/> <button onClick={this.props.onClick}>Запустить алгоритм Дейкстры</button>
                </div>);
    }
}