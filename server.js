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

var allowCrossDomain = function(req, res, next) {
    // res.header('Access-Control-Allow-Methods', 'PUT');
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Authorization, x-requested-with');
    res.header('Access-Control-Expose-Headers', 'Location, Date, Hello')
    res.header('Hello', 'hello, flyc')

    next();
}
app.use(allowCrossDomain);

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

var channelList = (new Array(10).fill().map(function(item, index) {
        return {
            channel_code: 'channel_code-' + (index + 1),
            channel_name: 'channel_name-' + (index + 1)
        };
    })),
    channelObject;

app.get('/channel-list', function(req, res) {
    res.json(channelList);
});
app.get('/channel-list/:channel_code', function(req, res) {
    var channel_code = req.params.channel_code;
    res.json((new Array(10).fill().map(function(item, index) {
        var sequence = index + 1;
        return {
            channel_code: channel_code,
            category_code: 'category_code-' + sequence,
            category_name: 'category_name-' + sequence
        };
    })));
});
app.get('/channel-list/:channel_code/:category_code', function(req, res) {
    var channel_code = req.params.channel_code,
        category_code = req.params.category_code;

    res.json((new Array(10).fill().map(function(item, index) {
        var sequence = index + 1;
        return {
            channel_code: channel_code,
            category_code: category_code,
            product_type_code: 'product_type_code-' + sequence,
            product_type_name: 'product_type_name-' + sequence
        };
    })));
});
app.get('/channel-list/:channel_code/:category_code/:product_type_code', function(req, res) {
    var channel_code = req.params.channel_code,
        category_code = req.params.category_code,
        product_type_code = req.params.product_type_code;

    res.json((new Array(10).fill().map(function(item, index) {
        var sequence = index + 1;
        return {
            channel_code: channel_code,
            category_code: category_code,
            product_type_code: product_type_code,
            play_type_code: 'play_type_code-' + sequence,
            play_type_name: 'play_type_name-' + sequence
        };
    })));
});

app.get('/app-domain', function(req, res) {
    res.json({
        key: 'value'
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