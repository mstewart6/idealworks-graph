# Basic Vanilla JS Graph Editor

Without any frameworks, a simple graph visualizer using Cytoscape.

### Basic Grammar
- `node <name>`: creates a node named `<name>`
- `<nodeA>--<nodeB>`: creates an undirected edge from `nodeA` to `nodeB` if both nodes exist
- `<nodeA>-><nodeB>`: creates a one-way edge from `nodeA` to `nodeB` if both nodes exist
- `<nodeA><>><nodeB>`: creates a bidrectional edge from `nodeA` to `nodeB` if both nodes exist

### Styling
- Nodes support color metadata
- Edges support colors, labels, and weights (edge thickness)

Metadata is specified as [property=value,property=value] after declaration of node or edge, e.g. `node a [color=fuchsia]` or `a--b [color=red,label=hello,weight=9]`

##  Running Server

(On a mac) Start a simple webserver in the directory. Using python, it would be:
```sh
python3 -m http.server 3000
```

## Design Notes

Based on a tool I use regularly for quickly putting together sequence diagrams: https://sequencediagram.org/

Utilizes a simple textarea with grammar that is parsed into nodes and edges. Passed into Cytoscape for rendering the graph. Wanted to be framework agnostic, such that any other API calls would just be adapted idiomatically.