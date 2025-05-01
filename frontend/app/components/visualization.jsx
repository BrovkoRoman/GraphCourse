import React from 'react'
import {getRandomInt} from "../utils/getRandomInt.js"
import {runDFS} from "../graphAlgorithms/dfs.js"
import {runBFS} from "../graphAlgorithms/bfs.js"
import {runDijkstra} from "../graphAlgorithms/dijkstra.js"
import {runFordBellman} from "../graphAlgorithms/ford-bellman.js"
import {runKruskal} from "../graphAlgorithms/kruskal.js"
import {DFS} from "./dfs.jsx"
import {BFS} from "./bfs.jsx"
import {Dijkstra} from "./dijkstra.jsx"
import {FordBellman} from "./ford-bellman.jsx"
import {Kruskal} from "./kruskal.jsx"

export class Visualization extends React.Component {
    constructor(props) {
        super(props);

        const vertices = [];

        for(let i = 0; i < 5; i++) {
            vertices[i] = {
                name: i + 1,
                x : 50 * (i + 1),
                y : 50 * (i + 1),
                radius: 20,
                color: "white",
                borderColor: "black",
                additionalInfo: "" // for algorithms that write information to vertices (e.g. shortest paths)
            };
        }

        const verticesOrder = []; // order in which the vertices should be painted

        for(let i = 0; i < 5; i++) {
            verticesOrder[i] = i;
        }

        const edges = [];

        for(let i = 0; i < 5; i++) {
            edges[i] = [];

            if(i < 4) {
                edges[i][i + 1] = {
                    color: "black",
                    weight: 1
                };
            }
        }

        this.state = {
            ctx: null, // canvas context
            isDirected: true,
            isWeighted: false,
            vertices: vertices,
            edges: edges,
            verticesOrder: verticesOrder,
            isVertexMoving: false, // moving vertex will always be last in verticesOrder
            movingVertexOffset: { // offset of moving vertex center relative to the mouse pointer
                x: 0,
                y: 0
            },
            operationsToDo: [],
            currentTimeout: -1, // to clear the previous run of the algorithm, it's necessary to clear previous timeout
            chosenAlgorithm: null
        };
        this.onCanvasLoad = this.onCanvasLoad.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.getTextFromGraph = this.getTextFromGraph.bind(this);
        this.onClickDFS = this.onClickDFS.bind(this);
        this.onClickBFS = this.onClickBFS.bind(this);
        this.onClickDijkstra = this.onClickDijkstra.bind(this);
        this.onClickFordBellman = this.onClickFordBellman.bind(this);
        this.onClickKruskal = this.onClickKruskal.bind(this);
        this.getVertexIndex = this.getVertexIndex.bind(this);
        this.setDirected = this.setDirected.bind(this);
        this.setWeighted = this.setWeighted.bind(this);
        this.onChangeAlgorithm = this.onChangeAlgorithm.bind(this);
    }
    getTextFromGraph() {
        const vertices = this.state.vertices;
        let ans = "";

        let hasEdges = [];

        for(let i = 0; i < vertices.length; i++) {
            for(let j = 0; j < vertices.length; j++) {
                if(!!this.state.edges[i][j]) {
                    hasEdges[i] = hasEdges[j] = 1;
                    ans += vertices[i].name + ' ' + vertices[j].name + "\n";
                }
            }
        }

        for(let i = 0; i < vertices.length; i++) {
            if(hasEdges[i] !== 1) {
                ans += vertices[i].name + "\n";
            }
        }

        return ans;
    }
    getGraphFromText(text) {
        const vertices = [];
        const edges = [];

        const lines = text.split("\n"); // each line of textarea is either a vertex or an edge

        for(let line of lines) {
            const vertexNames = line.split(" ").filter((s) => (s !== ""));
            let vertexIds = [];

            for(let ind = 0; ind < (vertexNames.length === 3 ? 2 : vertexNames.length); ind++) {
                const vertexName = vertexNames[ind];

                let id = -1;

                for(let i = 0; i < vertices.length; i++) {
                    if(vertices[i].name == vertexName) {
                        id = i;
                        break;
                    }
                }

                if(id === -1) { // new vertex
                    id = vertices.length;
                    edges[id] = [];

                    let oldId = -1;

                    for(let i = 0; i < this.state.vertices.length; i++) {
                        if(this.state.vertices[i].name == vertexName) {
                            oldId = i;
                            break;
                        }
                    }

                    if(oldId !== -1) { // if vertex with given name was in previous graph, its coordinates don't change
                        vertices.push(this.state.vertices[oldId]);
                    } else {
                        vertices.push({
                            name: vertexName,
                            x: getRandomInt(600),
                            y: getRandomInt(400),
                            radius: 20,
                            color: "white",
                            borderColor: "black"
                        });
                    }
                }

                vertexIds.push(id);
            }

            let len = vertexNames.length;

            if(len === 2 && !(!this.state.isDirected && !!edges[vertexIds[1]][vertexIds[0]])) {
                edges[vertexIds[0]][vertexIds[1]] = {
                    color: "black",
                    weight: 1
                };
            }
            else if(len === 3 && !(!this.state.isDirected && !!edges[vertexIds[1]][vertexIds[0]])) {
                let weight = Number(vertexNames[2]);
                if(!this.state.isWeighted) {
                    weight = 1;
                }
                edges[vertexIds[0]][vertexIds[1]] = {
                    color: "black",
                    weight: (isNaN(weight) ? 1 : weight)
                }
            }
        }

        let verticesOrder = [];

        for(let i = 0; i < vertices.length; i++) {
            verticesOrder.push(i);
        }

        clearTimeout(this.state.currentTimeout);

        this.setState({
            vertices: vertices,
            edges: edges,
            verticesOrder: verticesOrder,
            operationsToDo: ["clear"]
        },
        this.onCanvasLoad);
    }
    onClickDFS() {
        const dfsVertex = document.getElementById("dfsVertex").value;
        let ind = -1;

        for(let i = 0; i < this.state.vertices.length; i++) {
            if(this.state.vertices[i].name == dfsVertex) {
                ind = i;
            }
        }

        if(ind === -1) {
            alert("Такой вершины нет");
            return;
        }

        const operations = runDFS(this.state.vertices, this.state.edges, this.state.isDirected, ind);
        operations.unshift("clear");
        operations.push("clear");

        clearTimeout(this.state.currentTimeout);

        this.setState({operationsToDo: operations},
            this.onCanvasLoad);
    }
    onClickBFS() {
        const bfsVertex = document.getElementById("bfsVertex").value;
        let ind = -1;

        for(let i = 0; i < this.state.vertices.length; i++) {
            if(this.state.vertices[i].name == bfsVertex) {
                ind = i;
            }
        }

        if(ind === -1) {
            alert("Такой вершины нет");
            return;
        }

        const operations = runBFS(this.state.vertices, this.state.edges, this.state.isDirected, ind);
        operations.unshift("clear");
        operations.push("clear");

        clearTimeout(this.state.currentTimeout);

        this.setState({operationsToDo: operations},
            this.onCanvasLoad);
    }
    onClickDijkstra() {
        const dijkstraVertex = document.getElementById("dijkstraVertex").value;
        let ind = -1;

        for(let i = 0; i < this.state.vertices.length; i++) {
            if(this.state.vertices[i].name == dijkstraVertex) {
                ind = i;
            }
        }

        if(ind === -1) {
            alert("Такой вершины нет");
            return;
        }

        const operations = runDijkstra(this.state.vertices, this.state.edges, this.state.isDirected, ind);
        operations.unshift("clear");
        operations.push("clear");

        clearTimeout(this.state.currentTimeout);

        this.setState({operationsToDo: operations},
            this.onCanvasLoad);
    }
    onClickFordBellman() {
        const fordBellmanVertex = document.getElementById("fordBellmanVertex").value;
        let ind = -1;

        for(let i = 0; i < this.state.vertices.length; i++) {
            if(this.state.vertices[i].name == fordBellmanVertex) {
                ind = i;
            }
        }

        if(ind === -1) {
            alert("Такой вершины нет");
            return;
        }

        const operations = runFordBellman(this.state.vertices, this.state.edges, this.state.isDirected, ind);
        operations.unshift("clear");
        operations.push("clear");

        clearTimeout(this.state.currentTimeout);

        this.setState({operationsToDo: operations},
            this.onCanvasLoad);
    }
    onClickKruskal() {
        if(this.state.isDirected) {
            alert("Граф должен быть неориентированным");
            return;
        }

        const operations = runKruskal(this.state.vertices, this.state.edges);
        operations.unshift("clear");
        operations.push("clear");

        clearTimeout(this.state.currentTimeout);

        this.setState({operationsToDo: operations},
            this.onCanvasLoad);
    }
    setDirected() {
        clearTimeout(this.state.currentTimeout);

        if(document.getElementById("directed").checked) {
            this.setState({
                isDirected: true,
                operationsToDo: ["clear"]
            },
            (() => {this.getGraphFromText(document.getElementById("graphDescription").value)}));
        }
        else {
            this.setState({
                isDirected: false,
                operationsToDo: ["clear"]
            },
            (() => {this.getGraphFromText(document.getElementById("graphDescription").value)}));
        }
    }
    setWeighted() {
        clearTimeout(this.state.currentTimeout);

        if(document.getElementById("weighted").checked) {
            this.setState({
                isWeighted: true,
                operationsToDo: ["clear"]
            },
            (() => {this.getGraphFromText(document.getElementById("graphDescription").value)}));
        }
        else {
            this.setState({
                isWeighted: false,
                operationsToDo: ["clear"]
            },
            (() => {this.getGraphFromText(document.getElementById("graphDescription").value)}));
        }
    }
    onChangeAlgorithm() {
        clearTimeout(this.state.currentTimeout);
        const selectAlgorithm = document.getElementById("algorithm");
        const algorithm = selectAlgorithm.value;
        let algorithmObject = null;

        if(algorithm === "dfs") {
            algorithmObject = (<DFS onClick={this.onClickDFS}/>);
        } else if(algorithm === "bfs") {
            algorithmObject = (<BFS onClick={this.onClickBFS}/>);
        } else if(algorithm === "dijkstra") {
            algorithmObject = (<Dijkstra onClick={this.onClickDijkstra}/>);
        } else if(algorithm === "fordBellman") {
            algorithmObject = (<FordBellman onClick={this.onClickFordBellman}/>);
        } else if(algorithm === "kruskal") {
            algorithmObject = (<Kruskal onClick={this.onClickKruskal}/>);
        }

        this.setState({
            chosenAlgorithm: algorithmObject,
            operationsToDo: ["clear"]
        },
        this.onCanvasLoad);
    }
    render() {
        return (<div>
                    <canvas id="canvas" width={600} height={400}
                        style={{"border": "5px solid black"}}
                        onMouseDown={this.onMouseDown}
                        onMouseMove={this.onMouseMove}
                        onMouseUp={this.onMouseUp}/>
                    <textarea id="graphDescription"
                        defaultValue={this.getTextFromGraph()}
                        onInput={(e) => this.getGraphFromText(e.target.value)}
                        rows={10} cols={30}/><br/>
                    <input type="radio" id="directed" name="1" defaultChecked="checked" onChange={this.setDirected}/>
                    <label htmlFor="directed">Ориентированный</label>
                    <input type="radio" id="undirected" name="1" onChange={this.setDirected}/>
                    <label htmlFor="undirected">Неориентированный</label><br/>
                    <input type="radio" id="weighted" name="2" onChange={this.setWeighted}/>
                    <label htmlFor="weighted">Взвешенный</label>
                    <input type="radio" id="unweighted" name="2" defaultChecked="checked" onChange={this.setWeighted}/>
                    <label htmlFor="unweighted">Невзвешенный</label><br/>
                    <label htmlFor="algorithm">Алгоритм: </label>
                    <select id="algorithm" onChange={this.onChangeAlgorithm}>
                        <option value="dfs">Обход в глубину (DFS)</option>
                        <option value="bfs">Обход в ширину (BFS)</option>
                        <option value="dijkstra">Алгоритм Дейкстры</option>
                        <option value="fordBellman">Алгоритм Форда-Беллмана</option>
                        <option value="kruskal">Алгоритм Краскала</option>
                    </select>
                    {this.state.chosenAlgorithm}
                </div>);
    }

    drawVertex(v) {
        const ctx = this.state.ctx;

        ctx.beginPath();
        ctx.fillStyle=v.color;
        ctx.lineWidth = 5;
        ctx.strokeStyle=v.borderColor;
        ctx.arc(v.x, v.y, v.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.font = "30px sans";
        ctx.fillText(v.name, v.x, v.y);

        ctx.fillStyle = "blue";
        ctx.font = "20px sans";
        ctx.fillText(v.additionalInfo, v.x, v.y - v.radius - 15);
    }

    drawEdge(vIndex, uIndex, edgeStruct) {
        if(edgeStruct.color === "invisible") {
            return;
        }

        const v = this.state.vertices[vIndex];
        const u = this.state.vertices[uIndex];
        const ctx = this.state.ctx;
        ctx.lineWidth = 3;
        ctx.strokeStyle = edgeStruct.color;

        if(vIndex == uIndex) { // some magic to draw a self-loop
            ctx.beginPath();
            ctx.arc(v.x, v.y - v.radius * 1.7, v.radius, 0, 2 * Math.PI);

            if(this.state.isDirected) {
                const dy = 0.85;
                const dx = Math.sqrt(1 - dy * dy);
                const angle = Math.atan2(dx, dy);
                const arrowEndX = v.x - v.radius * dx;
                const arrowEndY = v.y - v.radius * dy;

                const deltaAngle1 = 0.7;
                const deltaAngle2 = 0.2;
                const arrowLength = 15;

                ctx.moveTo(arrowEndX, arrowEndY);
                ctx.lineTo(arrowEndX - Math.cos(angle + deltaAngle1) * arrowLength,
                           arrowEndY - Math.sin(angle + deltaAngle1) * arrowLength);

                ctx.moveTo(arrowEndX, arrowEndY);
                ctx.lineTo(arrowEndX - Math.cos(angle - deltaAngle2) * arrowLength,
                           arrowEndY - Math.sin(angle - deltaAngle2) * arrowLength);
            }

            if(this.state.isWeighted) {
                ctx.font = "20px sans";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                const middle = {x: u.x, y: u.y - 2.7 * u.radius - 10};
                ctx.fillStyle = edgeStruct.color;

                ctx.fillText(edgeStruct.weight, middle.x, middle.y);
            }

            ctx.stroke();
            return;
        }

        if((v.x - u.x) * (v.x - u.x) + (v.y - u.y) * (v.y - u.y) < (v.radius + u.radius) * (v.radius + u.radius)) {
            return;
        }

        const angle = Math.atan2(u.y - v.y, u.x - v.x);
        let shift = {x:0, y:0}; // shift is used for drawing two opposite directed edges

        if(this.state.isDirected && !!this.state.edges[uIndex][vIndex]) { // if there is an opposite edge, then make a shift
            const shiftDist = 8;

            shift = {x: Math.sin(angle) * shiftDist, y: -Math.cos(angle) * shiftDist};
                // shift vector is perpendicular to edge
        }

        if(this.state.isWeighted) {
            ctx.font = "20px sans";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const middle = {x: (u.x + v.x) / 2 + shift.x, y: (u.y + v.y) / 2 + shift.y};
            ctx.fillStyle = edgeStruct.color;

            const weightShiftDist = 15; // distance between edge and its weight number
            const dxWeight = Math.sin(angle) * weightShiftDist;
            const dyWeight = -Math.cos(angle) * weightShiftDist;

            ctx.fillText(edgeStruct.weight, middle.x + dxWeight, middle.y + dyWeight);
        }

        ctx.beginPath();

        if(this.state.isDirected) { // draw arrow
            ctx.moveTo(shift.x + v.x, shift.y + v.y);
            ctx.lineTo(shift.x + u.x, shift.y + u.y);

            const arrowEndX = u.x - Math.cos(angle) * u.radius;
            const arrowEndY = u.y - Math.sin(angle) * u.radius;

            const deltaAngle = 0.5;
            const arrowLength = 20;

            ctx.moveTo(shift.x + arrowEndX, shift.y + arrowEndY);
            ctx.lineTo(shift.x + arrowEndX - Math.cos(angle + deltaAngle) * arrowLength,
                       shift.y + arrowEndY - Math.sin(angle + deltaAngle) * arrowLength);

            ctx.moveTo(shift.x + arrowEndX, shift.y + arrowEndY);
            ctx.lineTo(shift.x + arrowEndX - Math.cos(angle - deltaAngle) * arrowLength,
                       shift.y + arrowEndY - Math.sin(angle - deltaAngle) * arrowLength);
        } else {
            ctx.moveTo(v.x, v.y);
            ctx.lineTo(u.x, u.y);
        }

        ctx.stroke();
    }

    onMouseDown(event) {
        if(event.buttons % 2 == 0) { // not left mouse button
            return;
        }

        clearTimeout(this.state.currentTimeout);

        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;

        let clickedVertex = -1;

        for(let i of this.state.verticesOrder) {
            const v = this.state.vertices[i];

            if((x - v.x) * (x - v.x) + (y - v.y) * (y - v.y) <= v.radius * v.radius) {
                clickedVertex = i;
            }
        }

        if(clickedVertex !== -1) {
            const verticesOrder = this.state.verticesOrder;

            let ind = verticesOrder.length - 1;

            while(verticesOrder[ind] !== clickedVertex) {
                ind--;
            }

            for(let i = ind; i < verticesOrder.length - 1; i++) {
                verticesOrder[i] = verticesOrder[i + 1];
            }

            verticesOrder[verticesOrder.length - 1] = clickedVertex;
            const v = this.state.vertices[clickedVertex];

            this.setState({
                    verticesOrder: verticesOrder,
                    isVertexMoving: true,
                    movingVertexOffset: {
                        x: v.x - x,
                        y: v.y - y
                    },
                    operationsToDo: ["clear"]
                },
                this.onCanvasLoad);
        }
    }

    onMouseMove(event) {
        if(!this.state.isVertexMoving) {
            return;
        }

        clearTimeout(this.state.currentTimeout);

        const vertices = this.state.vertices;
        const movingVertex = this.state.verticesOrder[this.state.verticesOrder.length - 1];

        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;

        vertices[movingVertex].x = x + this.state.movingVertexOffset.x;
        vertices[movingVertex].y = y + this.state.movingVertexOffset.y;

        this.setState({
                vertices: vertices,
                operationsToDo: ["clear"]
            },
            this.onCanvasLoad);
    }

    onMouseUp(event) {
        clearTimeout(this.state.currentTimeout);
        this.setState({
                isVertexMoving: false,
                operationsToDo: ["clear"]
            },
            this.onCanvasLoad);
    }
    getVertexIndex(name) {
        let ind = -1;

        for(let i = 0; i < this.state.vertices.length; i++) {
            if(this.state.vertices[i].name == name) {
                ind = i;
                break;
            }
        }

        return ind;
    }
    onCanvasLoad() {
        const ctx = this.state.ctx;

        if(!ctx) {
            return;
        }

        ctx.fillStyle="aquamarine";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const vertices = this.state.vertices;
        const edges = this.state.edges;
        const operations = this.state.operationsToDo;

        if(operations.length > 0) {
            const op = operations[0];
            const opSplit = op.split(" ");

            if(opSplit[0] === "mark") {
                for(let i = 0; i < vertices.length; i++) {
                    if(vertices[i].borderColor === "blue") {
                        vertices[i].borderColor = "black";
                    }
                }
                const v = this.getVertexIndex(opSplit[1]);
                vertices[v].borderColor = "blue";
            } else if(opSplit[0] === "unmark") {
                for(let i = 0; i < vertices.length; i++) {
                    if(vertices[i].borderColor === "blue") {
                        vertices[i].borderColor = "black";
                    }
                }
            } else if(opSplit[0] === "visit") {
                const v = this.getVertexIndex(opSplit[1]);
                vertices[v].color = "grey";
            } else if(opSplit[0] === "unvisit") {
                const v = this.getVertexIndex(opSplit[1]);
                vertices[v].color = "white";
            } else if(opSplit[0] === "setInfo") {
                const v = this.getVertexIndex(opSplit[1]);
                vertices[v].additionalInfo = opSplit[2];
            } else if(opSplit[0] === "edge") {
                const u = this.getVertexIndex(opSplit[1]);
                const v = this.getVertexIndex(opSplit[2]);
                edges[u][v].color = opSplit[3];

                if(!this.state.isDirected && !!edges[v][u]) {
                    edges[v][u].color = opSplit[3];
                }
            } else if(opSplit[0] === "clear") {
                for(let i = 0; i < vertices.length; i++) {
                    vertices[i].color = "white";
                    vertices[i].borderColor = "black";
                    vertices[i].additionalInfo = "";

                    for(let j = 0; j < vertices.length; j++) {
                        if(!!edges[i][j]) {
                            edges[i][j].color = "black";
                        }
                    }
                }
            }

            operations.shift();
            const rebuild = () => {
                this.setState({
                    vertices: vertices,
                    edges: edges
                }, this.onCanvasLoad);
            };

            if(opSplit[0] === "delay") {
                this.state.currentTimeout = setTimeout(rebuild, 500);
            } else {
                rebuild();
            }
        }

        for(let i = 0; i < vertices.length; i++) {
            for(let j = 0; j < vertices.length; j++) {
                if(!!edges[i][j]) {
                    this.drawEdge(i, j, edges[i][j]);
                }
            }
        }

        for(let i of this.state.verticesOrder) {
            this.drawVertex(vertices[i]);
        }
    }

    componentDidMount() {
        if(this.state.chosenAlgorithm === null) {
            this.onChangeAlgorithm();
        }

        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        this.setState({
                ctx: ctx
            },
            this.onCanvasLoad);
    }
}