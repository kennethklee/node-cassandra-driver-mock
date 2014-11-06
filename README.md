node-cassandra-driver-mock
==========================

Basic mocking of cassandra-driver node module. Really, it just records the total number of requests and connections made.

install
-------

```bash
npm install -save-dev cassandra-driver-mock
```

usage
-----

```javascript
var cassandraMock = require('cassandra-driver-mock');
var Cassandra = require('cassandra-driver').Client;

var cassandra = new Cassandra({contactPoints: ['localhost'], keyspace: 'keyspace1'});
cassandra.execute('SOME QUERY', function(err, result) {
    console.log(cassandraMock.requestCount) // 1
    console.log(cassandraMock.connectionCount) // 1

    // do another query...

    cassandra.execute('SOME QUERY', function(err, result) {
        console.log(cassandraMock.requestCount) // 2
        console.log(cassandraMock.connectionCount) // 1
    });
});
```
