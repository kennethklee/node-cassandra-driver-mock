var rewire = require('rewire');
    cassandra = require('cassandra-driver'),
    Encoder = require('cassandra-driver/lib/encoder');

var mockClient = rewire('cassandra-driver/lib/client');

exports.connectionCount = 0;
exports.requestCount = 0;

mockClient.prototype.connect = function (callback) {
    if (this.connected) return callback();
    this.connected = true;
    this.connecting = false;

    this.metadata = this.controlConnection.metadata;
    this.controlConnection.connection = {
        encoder: new Encoder(null, this.controlConnection.options)
    };

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

mockRequestHandler.prototype.prepareMultiple = function (queries, callbacksArray, options, callback) {
    // Collect prepare queries
    exports.requestCount += queries.length;

    callback();
};

mockClient.__set__('RequestHandler', mockRequestHandler);
cassandra.Client = mockClient;
