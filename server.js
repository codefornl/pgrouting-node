var express = require('express'),
        errorhandler = require('errorhandler'),
        bodyParser = require('body-parser'),
        http = require('http'),
        path = require('path'),
        fs = require('fs'),
        proxy = require('express-http-proxy'),
        compress = require('compression');
var env = process.env.NODE_ENV || 'development';
var app = express();
if ('development' == env) {
    app.use(errorhandler({dumpExceptions: true, showStack: true}));
}

if ('production' == env) {
    app.use(errorhandler());
}

// Configuration
app.set('port', process.env.PORT || 8080);
app.use(compress());
app.enable('trust proxy');
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use('/rws', proxy('rijkswaterstaatstrooit.nl', {
  https: true,
  filter: function(req, res) {
     return req.method == 'GET';
  }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (err, req, res, next) {
    var errobj = {};
    errobj.url = req.protocol + "://" + req.get('host') + req.url;
    errobj.body = req.body;
    errobj.query = req.query;
    errobj.params = req.params;
    res.status(500);
    res.render('error', {title: 'error', request: JSON.stringify(errobj), error: err});
});

app.use(require('./controllers'));
function start() {
    app.listen(app.get('port'), function () {
        console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
    });
}
exports.start = start;
exports.app = app;
