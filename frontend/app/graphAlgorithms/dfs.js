let used, operations, vertices, edges, isDirected;

function dfs(v) {
    used[v] = 1;
    operations.push("mark " + vertices[v].name);
    operations.push("visit " + vertices[v].name);
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
                dfs(i);

                operations.push("mark " + vertices[v].name);
                operations.push("delay");
            } else {
                operations.push("delay");
            }
        }
    }
}

export function runDFS(Vertices, Edges, IsDirected, start) {
    used = [];
    operations = [];
    vertices = Vertices;
    edges = Edges;
    isDirected = IsDirected;

    dfs(start);

    return operations;
}

