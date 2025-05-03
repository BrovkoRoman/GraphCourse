import React from 'react'

export class DFS extends React.Component {
    render() {
        return (<div>
                    <input id="dfsVertex"
                       placeholder="вершина"/> <button onClick={this.props.onClick}>Запустить DFS</button>
                </div>);
    }
}