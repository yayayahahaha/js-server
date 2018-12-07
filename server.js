var express = require('express');
var app = express();
var fs = require('fs');
var _ = require('lodash');

var dbPath = 'db/data.json',
    db = fs.readFileSync(dbPath);
db = JSON.parse(db);

app.get('/list', function(req, res) {
    res.json([1, 2, 3, 4, 5, 5, 7, 7, 8, 9, 0, 1]);
});

app.get('*', function(req, res) {
    res.status(404).json({
        message: 'nothing found'
    });
});

var server = app.listen(8888, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('地址: http://%s:%s', host, port);
});