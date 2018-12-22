var express = require('express');
var app = express();
var fs = require('fs');
var _ = require('lodash');

var pagerFunction = function(sourceArray, page, per_page) {
    sourceArray = sourceArray ? sourceArray : [];
    var chunkArray = [],
        returnArray = [],
        returnMeta = {
            page: page,
            per_page: per_page,
            total_page: 0,
            total_count: sourceArray.length
        };

    chunkArray = _.chunk(sourceArray, per_page);
    returnArray = chunkArray[page - 1];
    returnMeta.total_page = chunkArray.length;
    return {
        data: returnArray,
        meta: returnMeta
    };
}

var JsonDataBase = function(initData) {
    initData = initData ? initData : {};

    this.dbPath = typeof initData.dbPath === 'string' ? initData.dbPath : '';

    this.instance = (function(dbPath) {

        if (!fs.existsSync(dbPath)) {
            console.log('傳入的dbPath 沒有找到相對應的檔案，創建失敗!');
            return null;
        }

    })(this.dbPath);
}

var db = new JsonDataBase({
    dbPath: 'db/data.json'
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'PUT');
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Authorization');

    next();
}
app.use(allowCrossDomain);

// 初始的database 要長怎樣
function initDataBase(write) {
    write = typeof write !== 'undefined' ? write : true;

    db.array = (new Array(1)).fill().map(function(item, index) {
        return index + 1;
    });

    // if (write) fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return db;
}
initDataBase();

function updateDataBase() {
}

// 有點算是範例的兩個路由 start
/*
app.get('/list', function(req, res) {
    res.json([1, 2, 3, 4, 5, 5, 7, 7, 8, 9, 0, 1]);
});
app.post('/user', function(req, res) {
    if (!db.userList) {
        db.userList = [];
    }
    db.userList.push((new Array(2)).fill(null).map(function(item) {
        return Math.random().toString();
    }).splice(2).join(''));

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json({
        status: '200',
        message: '新增成功'
    });
});
*/
// 有點算是範例的兩個路由 end

app.get('/app-domain', function(req, res) {
    db.randomNumber = Math.random();
    // fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.json({
        app_domain: db['app_domain']
    });
});

app.put('/app-domain', function(req, res) {
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
        _responseToClient(JSON.parse(body));
    });
    req.on('end', () => {
        // 這裡也可以回傳?
    });

    function _responseToClient(data) {
        // fs.writeFileSync(dbPath, JSON.stringify(JSON.parse(body), null, 2));
        res.json(data);
    }
})

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