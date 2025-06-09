import { Node } from "./node.js";
import { Edge } from "./edge.js";

(function () {
  const nodePrefix = 'node ';
  const metadataStart = '[';
  const metadataEnd = ']';
  const colorPrefix = 'color=';
  const labelPrefix = 'label=';
  const weightPrefix = 'weight=';
  const undirected = '--';
  const oneWay = '->';
  const bidrectional = '<>';
  const localStorageKey = 'GRAPH_TEXT'

  const form = document.getElementById('graph-form');
  form.addEventListener('submit', handleUpdate);

  let nodes = {};
  let edges = [];

  const storedText = localStorage.getItem(localStorageKey);

  if (storedText) {
    updateGraph(storedText);
    document.getElementById('graph-data').value = storedText;
  }

  function handleUpdate(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const dataObject = Object.fromEntries(data.entries());
    const textAreaText = dataObject.graphData;

    updateGraph(textAreaText)
  }

  function updateGraph(textAreaText) {
    nodes = {};
    edges = [];

    processGraphData(textAreaText);
    drawGraph();

    localStorage.setItem(localStorageKey, textAreaText);
  }

  function processGraphData(rawInput) {
    const rows = rawInput.split("\n");

    rows.forEach((row) => {
      const stripped = row.trim();
      const normalized = stripped.toLowerCase();

      if (stripped === '') {
        return;
      }

      const metadata = extractMetadata(stripped);

      if (normalized.indexOf(nodePrefix) === 0) {
        createNode(stripped.substring(nodePrefix.length), metadata);
      } else if (normalized.indexOf(undirected) !== -1) {
        createUndirectedEdge(stripped, metadata);
      } else if (normalized.indexOf(oneWay) !== -1) {
        createOneWayEdge(stripped, metadata);
      } else if (normalized.indexOf(bidrectional) !== -1) {
        createBidirectionalEdge(stripped, metadata);
      }
    });
  }

  function extractMetadata(rawInput) {
    const startIndex = rawInput.indexOf(metadataStart);
    const endIndex = rawInput.indexOf(metadataEnd);
    const structuredMetadata = {};

    if (startIndex === -1 || endIndex === -1) {
      return structuredMetadata;
    }

    const allMetadata = rawInput.substring(startIndex + 1, endIndex);

    allMetadata.split(',').forEach(metadata => {
      if (metadata.trim().toLowerCase().indexOf(colorPrefix) === 0) {
        structuredMetadata.color = metadata.substring(colorPrefix.length);
      }
      if (metadata.trim().toLowerCase().indexOf(labelPrefix) === 0) {
        structuredMetadata.label = metadata.substring(labelPrefix.length);
      }
      if (metadata.trim().toLowerCase().indexOf(weightPrefix) === 0) {
        structuredMetadata.weight = Number(metadata.substring(weightPrefix.length));
      }
    });

    return structuredMetadata;
  }

  function createNode(data, metadata) {
    let id, color, node;
    if (metadata.color) {
      const metadataStartIndex = data.indexOf(metadataStart);
      id = data.substring(0, metadataStartIndex).trim();
      node = new Node(id, metadata.color);

    } else {
      node = new Node(data.trim());
    }

    nodes[node.id] = node;
  }

  function createUndirectedEdge(data, metadata) {
    let [source, destination] = data.split(undirected);

    if (destination.indexOf(metadataStart) !== -1) {
      destination = destination.substring(0, destination.indexOf(metadataStart)).trim();
    }

    if (nodes[source] && nodes[destination]) {
      edges.push(Edge.undirected(source, destination, metadata.label, metadata.weight, metadata.color));
    }
  }

  function createOneWayEdge(data, metadata) {
    let [source, destination] = data.split(oneWay);

    if (destination.indexOf(metadataStart) !== -1) {
      destination = destination.substring(0, destination.indexOf(metadataStart)).trim();
    }

    if (nodes[source] && nodes[destination]) {
      edges.push(Edge.directed(source, destination, metadata.label, metadata.weight, metadata.color));
    }
  }

  function createBidirectionalEdge(data, metadata) {
    let [source, destination] = data.split(bidrectional);

    if (destination.indexOf(metadataStart) !== -1) {
      destination = destination.substring(0, destination.indexOf(metadataStart)).trim();
    }

    if (nodes[source] && nodes[destination]) {
      edges.push(Edge.bidrectional(source, destination, metadata.label, metadata.weight, metadata.color));
    }
  }

  function drawGraph() {
    let elements = [];

    for (var key of Object.keys(nodes)) {
      elements = elements.concat({
        data: { id: key, color: nodes[key].color }
      });
    }

    var cy = cytoscape({

      container: document.getElementById('cy'), // container to render in

      elements:
        elements.concat(
          edges.map(edge => {
            const sourceShape = edge.hasSourceArrow() ? 'triangle' : 'none'
            const destinationShape = edge.hasDestinationArrow() ? 'triangle' : 'none'

            return {
              data: {
                id: edge.id,
                source: edge.source,
                target: edge.destination,
                color: edge.color,
                weight: edge.weight,
                label: edge.label,
                sourceArrow: sourceShape,
                destinationArrow: destinationShape
              }
            }
          })),

      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 'data(weight)',
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'data(destinationArrow)',
            'source-arrow-color': 'data(color)',
            'source-arrow-shape': 'data(sourceArrow)',
            'curve-style': 'bezier',
            'label': 'data(label)',
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: Math.ceil(Math.sqrt(elements.length))
      }

    });
  }
})();