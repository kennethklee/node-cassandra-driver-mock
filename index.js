var rewire = require('rewire');
    cassandra = require('cassandra-driver');
    ControlConnection = require('cassandra-driver/lib/control-connection');

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
    if (this.options.prepare) {
        var self = this;
        this.controlConnection = new ControlConnection(this.options);
        this.controlConnection.init(function(err) {
            if (err) return connectCallback(err);
            //we have all the data from the cluster
            self.hosts = self.controlConnection.hosts;
            self.metadata = self.controlConnection.metadata;
            if (err) return connectCallback(err);
            if (self.keyspace) {
                return self._setKeyspaceFirst(connectCallback);
            }
            connectCallback();
        });
    }
    connectCallback()
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
