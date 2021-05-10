function Node(id, type) {
    this.id = id;
    this.type = type;
    this.connections = [];
}

module.exports = Node;