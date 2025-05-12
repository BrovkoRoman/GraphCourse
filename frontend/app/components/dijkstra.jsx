import React from 'react'

export class Dijkstra extends React.Component {
    render() {
        return (<div>
                    <input id="dijkstraVertex" className="vertex"
                    placeholder="вершина"/> <button onClick={this.props.onClick} className="ml10">Запустить алгоритм Дейкстры</button>
                </div>);
    }
}