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

## Running Server

(On a mac) Start a simple webserver in the directory. Using python, it would be:

```sh
python3 -m http.server 3000
```

## Design Notes

Based on a tool I use regularly for quickly putting together sequence diagrams: <https://sequencediagram.org/>

Utilizes a simple textarea with grammar that is parsed into nodes and edges. Passed into Cytoscape for rendering the graph. Wanted to be framework agnostic, such that any other API calls would just be adapted idiomatically.

For offline storage, I am using the basic localStorage to do a key-value storage of the full data of the text area. If the store has data in it on page load, the graph is drawn from that, and the data is loaded into the textarea. For longer term construction, it would make more sense to match up a node/edge strcture in the IndexedDB that mirrors the backend, but for this application without a backend at the moment, it made more sense to keep things simple. Additionally, this would be adapted based on our graph renderer. Since I am using cytoscape on the fly (and given the time constraints), I wanted to optimize around rendering. If we were building out our own rendering library, I would recommend a real graph structure for the nodes that we could pass into the library (which would similarly work well with backend storage). Additionally, this is frontend-heavy, but not particularly multitenant, or even structured in a way to enable a single user to have multiple graphs as necessary, so would want to do some authentication and way to differentiate multiple graphs.
