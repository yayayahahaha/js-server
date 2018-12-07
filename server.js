var express = require('express');
var app = express();
var fs = require('fs');
var _ = require('lodash');

var dbPath = 'db/data.json',
    db = fs.readFileSync(dbPath);
db = JSON.parse(db);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Authorization');

    next();
}
app.use(allowCrossDomain);

app.get('/list', function(req, res) {
    res.json([1, 2, 3, 4, 5, 5, 7, 7, 8, 9, 0, 1]);
});

app.post('/user', function(req, res) {
    if (!db.userList) {
        db.userList = [];
    }
    db.userList.push((new Array(2)).fill(null).map(function(item) {
        return Math.random();
    }).join('').replace(/\./g, ''));
    fs.writeFileSync(dbPath, JSON.stringify(db));
    res.json({
        status: '200',
        message: '新增成功'
    });
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