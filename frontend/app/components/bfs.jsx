import React from 'react'

export class BFS extends React.Component {
    render() {
        return (<div>
                    <input id="bfsVertex" className="vertex"
                    placeholder="вершина"/> <button onClick={this.props.onClick} className="ml10">Запустить BFS</button>
                </div>);
    }
}