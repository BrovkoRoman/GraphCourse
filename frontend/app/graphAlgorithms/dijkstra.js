let used, operations, vertices, edges, isDirected;

function dijkstra(v) {
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

    for(let i = 0; i < vertices.length; i++) {
        let mn = -1;

        for(let j = 0; j < vertices.length; j++) {
            if(used[j] !== 1 && (mn === -1 || dist[j] !== INF && (dist[mn] === INF || dist[j] < dist[mn]))) {
                mn = j;
            }
        }

        operations.push("mark " + vertices[mn].name);
        operations.push("visit " + vertices[mn].name);
        operations.push("delay");
        let v = mn;
        used[v] = 1;

        for(let i = 0; i < vertices.length; i++) {
            if(!!edges[v][i] || !isDirected && !!edges[i][v]) {
                if(!!edges[v][i]) {
                    operations.push("edge " + vertices[v].name + ' ' + vertices[i].name + " red");
                    operations.push("delay");
                    operations.push("edge " + vertices[v].name + ' ' + vertices[i].name + " black");

                    if(used[i] !== 1 && dist[v] !== INF && (dist[i] === INF || dist[v] + edges[v][i].weight < dist[i])) {
                        dist[i] = dist[v] + edges[v][i].weight;
                        operations.push("setInfo " + vertices[i].name + " " + dist[i]);
                    }

                    operations.push("delay");

                } else {
                    operations.push("edge " + vertices[i].name + ' ' + vertices[v].name + " red");
                    operations.push("delay");
                    operations.push("edge " + vertices[i].name + ' ' + vertices[v].name + " black");

                    if(used[i] !== 1 && dist[v] !== INF && (dist[i] === INF || dist[v] + edges[i][v].weight < dist[i])) {
                        dist[i] = dist[v] + edges[i][v].weight;
                        operations.push("setInfo " + vertices[i].name + " " + dist[i]);
                    }

                    operations.push("delay");
                }
            }
        }
    }
}

export function runDijkstra(Vertices, Edges, IsDirected, start) {
    used = [];
    operations = [];
    vertices = Vertices;
    edges = Edges;
    isDirected = IsDirected;

    dijkstra(start);

    return operations;
}

