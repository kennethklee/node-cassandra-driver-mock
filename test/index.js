require('should');
var cassandraMock = require('../index');
var Cassandra = require('cassandra-driver').Client;

describe('Mock', function() {

    // This must be the first test
    it('should have zero request and connection counts', function() {
        cassandraMock.requestCount.should.equal(0);
        cassandraMock.connectionCount.should.equal(0);
    });

    it('should increment 1 request count and 1 connection count for one query with a new connection', function(done) {
        var lastRequestCount = cassandraMock.requestCount;
        var lastConnectionCount = cassandraMock.connectionCount;

        var cassandra = new Cassandra({contactPoints: ['localhost'], keyspace: 'keyspace1'});
        cassandra.execute('SOME QUERY', function(err, result) {
            cassandraMock.requestCount.should.equal(lastRequestCount + 1);
            cassandraMock.connectionCount.should.equal(lastConnectionCount + 1);

            done();
        });
    });

    it('should increment 2 request count and 1 connection count for two queries under one connection', function(done) {
        var lastRequestCount = cassandraMock.requestCount;
        var lastConnectionCount = cassandraMock.connectionCount;
        console.log(lastRequestCount);

        var cassandra = new Cassandra({contactPoints: ['localhost'], keyspace: 'keyspace1'});
        cassandra.execute('SOME QUERY', function(err, result) {
            // Execute another query
            cassandra.execute('ANOTHER QUERY', function(err, result) {
                cassandraMock.requestCount.should.equal(lastRequestCount + 2);
                cassandraMock.connectionCount.should.equal(lastConnectionCount + 1);

                done();
            });
        });
    });
});