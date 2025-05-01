let operations, vertices, edges, isDirected;

function fordBellman(v) {
    let dist = [];
    const INF = "+∞";

    for(let i = 0; i < vertices.length; i++) {
        dist.push(INF);
    }

    dist[v] = 0;

    for(let i = 0; i < vertices.length; i++) {
        operations.push("setInfo " + vertices[i].name + " " + dist[i]);
    }

    operations.push("delay");

    for(let iter = 0; iter < vertices.length - 1; iter++) {
        for(let v = 0; v < vertices.length; v++) {
            operations.push("mark " + vertices[v].name);
            operations.push("delay");

            for(let i = 0; i < vertices.length; i++) {
                if(!!edges[v][i] || !isDirected && !!edges[i][v]) {
                    if(!!edges[v][i]) {
                        operations.push("edge " + vertices[v].name + ' ' + vertices[i].name + " red");
                        operations.push("delay");
                        operations.push("edge " + vertices[v].name + ' ' + vertices[i].name + " gray");

                        if(dist[v] !== INF && (dist[i] === INF || dist[v] + edges[v][i].weight < dist[i])) {
                            dist[i] = dist[v] + edges[v][i].weight;
                            operations.push("setInfo " + vertices[i].name + " " + dist[i]);
                        }

                        operations.push("delay");

                    } else {
                        operations.push("edge " + vertices[i].name + ' ' + vertices[v].name + " red");
                        operations.push("delay");
                        operations.push("edge " + vertices[i].name + ' ' + vertices[v].name + " gray");

                        if(dist[v] !== INF && (dist[i] === INF || dist[v] + edges[i][v].weight < dist[i])) {
                            dist[i] = dist[v] + edges[i][v].weight;
                            operations.push("setInfo " + vertices[i].name + " " + dist[i]);
                        }

                        operations.push("delay");
                    }
                }
            }
        }

        for(let i = 0; i < vertices.length; i++) {
            for(let j = 0; j < vertices.length; j++) {
                if(!!edges[i][j]) {
                    operations.push("edge " + vertices[i].name + " " + vertices[j].name + " black");
                }
            }
        }
        operations.push("unmark");
        operations.push("delay");
    }
}

export function runFordBellman(Vertices, Edges, IsDirected, start) {
    operations = [];
    vertices = Vertices;
    edges = Edges;
    isDirected = IsDirected;

    fordBellman(start);

    return operations;
}

