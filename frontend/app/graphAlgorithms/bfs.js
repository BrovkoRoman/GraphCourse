let used, operations, vertices, edges, isDirected;

function bfs(v) {
    used[v] = 1;
    let queue = [v];
    let queueIndex = 0;

    operations.push("visit " + vertices[v].name);

    while(queueIndex < queue.length) {
        let v = queue[queueIndex];
        queueIndex++;
        operations.push("mark " + vertices[v].name);
        operations.push("delay");

        for(let i = 0; i < vertices.length; i++) {
            if(!!edges[v][i] || !isDirected && !!edges[i][v]) {
                if(!!edges[v][i]) {
                    operations.push("edge " + vertices[v].name + ' ' + vertices[i].name + " red");
                    operations.push("delay");
                    operations.push("edge " + vertices[v].name + ' ' + vertices[i].name + " black");
                } else {
                    operations.push("edge " + vertices[i].name + ' ' + vertices[v].name + " red");
                    operations.push("delay");
                    operations.push("edge " + vertices[i].name + ' ' + vertices[v].name + " black");
                }

                if(used[i] !== 1) {
                    used[i] = 1;
                    operations.push("visit " + vertices[i].name);
                    operations.push("delay");
                    queue.push(i);
                } else {
                    operations.push("delay");
                }
            }
        }
    }
}

export function runBFS(Vertices, Edges, IsDirected, start) {
    used = [];
    operations = [];
    vertices = Vertices;
    edges = Edges;
    isDirected = IsDirected;

    bfs(start);

    return operations;
}

