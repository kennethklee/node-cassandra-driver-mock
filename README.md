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
// Mock must be required before cassandra-driver.
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

support
-------

Donations are welcome to help support the continuous development of this project.

[![Flattr][flattr-image]][flattr-url]
[![Bitcoin][bitcoin-image]][bitcoin-url]


[flattr-url]: https://flattr.com/submit/auto?user_id=kennethkl&url=https://github.com/kennethklee/cassandra-driver-mock&title=cassandra-driver-mock&language=&tags=github&category=software
[flattr-image]: http://img.shields.io/badge/flattr-donate-green.svg?style=flat-square

[bitcoin-image]: http://img.shields.io/badge/bitcoin-1L9EhwhiSTPtEoXeGDBABRXmEJwovwkWpk-green.svg?style=flat-square
[bitcoin-url]: https://www.coinbase.com/checkouts/5653371de64aa773f372a1e33c569095?name=cassandra-driver-mock
