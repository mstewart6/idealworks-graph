export class Edge {
  id;
  label;
  weight;
  color;
  source;
  destination;
  direction;

  constructor(source, destination, label, weight, color, direction) {
    this.source = source;
    this.destination = destination;
    this.label = label ?? "";
    this.weight = weight ?? 3;
    this.color = color ?? "#ccc";
    this.direction = direction ?? EdgeDirection.NONE;
    this.id = `${source}${direction}${destination}`;
  }

  static undirected(source, destination, label, weight, color) {
    return new Edge(source, destination, label, weight, color, EdgeDirection.NONE);
  }

  static directed(source, destination, label, weight, color) {
    return new Edge(source, destination, label, weight, color, EdgeDirection.ONE_WAY);
  }

  static bidrectional(source, destination, label, weight, color) {
    return new Edge(source, destination, label, weight, color, EdgeDirection.BIDIRECTIONAL);
  }

  hasSourceArrow() {
    return SOURCE_ARROWS.has(this.direction);
  }

  hasDestinationArrow() {
    return DESTINATION_ARROWS.has(this.direction);
  }
}

const EdgeDirection = Object.freeze({
  NONE: 0,
  ONE_WAY: 1,
  BIDIRECTIONAL: 2
});
const SOURCE_ARROWS = new Set([EdgeDirection.BIDIRECTIONAL]);
const DESTINATION_ARROWS = new Set([EdgeDirection.ONE_WAY, EdgeDirection.BIDIRECTIONAL]);
