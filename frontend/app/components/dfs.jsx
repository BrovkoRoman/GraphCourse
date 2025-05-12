import React from 'react'

export class DFS extends React.Component {
    render() {
        return (<div>
                    <input id="dfsVertex" className="vertex"
                       placeholder="вершина"/> <button onClick={this.props.onClick} className="ml10">Запустить DFS</button>
                </div>);
    }
}