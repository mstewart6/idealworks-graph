export class Node {
  id = "";
  color = "black";

  constructor(id, color) {
    this.id = id;
    this.color = color ?? "black";
  }
}