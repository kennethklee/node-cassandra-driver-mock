var rewire = require('rewire');
    cassandra = require('cassandra-driver');
    Metadata = require('cassandra-driver/lib/metadata');

var mockClient = rewire('cassandra-driver/lib/client');

exports.connectionCount = 0;
exports.requestCount = 0;

mockClient.prototype.connect = function (callback) {
    if (this.connected) return callback();
    this.connected = true;
    this.connecting = false;
    function connectCallback(err) {
        // Collect stats
        exports.connectionCount++;

        self.connected = !err;
        self.connecting = false;
        try {
            callback(err);
        }
        finally {
          self.emit('connected', err);
        }
    }
    var self = this;
    this.metadata = new Metadata(this.options);
    connectCallback();
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
