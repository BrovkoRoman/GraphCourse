import React from 'react'

export class BFS extends React.Component {
    render() {
        return (<div>
                    <input id="bfsVertex"
                    placeholder="вершина"/> <button onClick={this.props.onClick}>Запустить BFS</button>
                </div>);
    }
}