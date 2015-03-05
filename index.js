var rewire = require('rewire');
    cassandra = require('cassandra-driver');

var mockClient = rewire('cassandra-driver/lib/client');

exports.connectionCount = 0;
exports.requestCount = 0;

mockClient.prototype.connect = function (callback) {
    if (this.connected) return callback();
    this.connected = true;
    this.connecting = false;

    // Collect stats
    exports.connectionCount++;

    try {
        callback();
    } finally {
        this.emit('connected');
    }
};

var mockRequestHandler = function () {};
mockRequestHandler.prototype.send = function (query, options, cb) {
    // Collect stats
    if (query.query) {
        exports.requestCount++;
    }
    if (query.queries) {
        exports.requestCount += query.queries.length;
    }

    cb(null, {id: new Buffer([0]), meta: {columns: []}});
};
mockClient.__set__('RequestHandler', mockRequestHandler);
cassandra.Client = mockClient;
