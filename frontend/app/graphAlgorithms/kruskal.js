let operations, vertices, edges;

let p, siz; // DSU

function get(x) {
    if(x == p[x]) {
        return x;
    }

    p[x] = get(p[x]);
    return p[x];
}

function unite(x, y) {
    x = get(x);
    y = get(y);

    if(x == y) {
        return;
    }

    if(siz[x] > siz[y]) {
        const tmp = x;
        x = y;
        y = tmp;
    }

    p[x] = y;
    siz[y] += siz[x];
}

function kruskal() {
    p = [];
    siz = [];

    for(let i = 0; i < vertices.length; i++) {
        p[i] = i;
        siz[i] = 1;
    }

    let edgesList = [];

    for(let i = 0; i < vertices.length; i++) {
        for(let j = 0; j < vertices.length; j++) {
            if(!!edges[i][j] && (!edges[j][i] || i <= j)) {
                edgesList.push({
                    i: i,
                    j: j,
                    weight: edges[i][j].weight
                });
            }
        }
    }

    edgesList.sort(function(a, b) {
        return a.weight - b.weight;
    });

    for(let edge of edgesList) {
        const v = edge.i;
        const u = edge.j;

        operations.push("edge " + vertices[v].name + " " + vertices[u].name + " blue");
        operations.push("delay");

        if(get(v) === get(u)) {
            operations.push("edge " + vertices[v].name + " " + vertices[u].name + " invisible");
            operations.push("delay");
        } else {
            unite(u, v);
            operations.push("edge " + vertices[v].name + " " + vertices[u].name + " red");
            operations.push("delay");
        }
    }
}

export function runKruskal(Vertices, Edges) {
    operations = [];
    vertices = Vertices;
    edges = Edges;

    kruskal();

    return operations;
}

