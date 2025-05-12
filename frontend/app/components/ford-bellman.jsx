import React from 'react'

export class FordBellman extends React.Component {
    render() {
        return (<div>
                    <input id="fordBellmanVertex" className="vertex"
                    placeholder="вершина"/> <button onClick={this.props.onClick} className="ml10">
                                                Запустить алгоритм Форда-Беллмана
                                            </button>
                </div>);
    }
}