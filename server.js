var express = require('express');
var basicAuth = require('basic-auth');

var app = express(),
    config = require('./config.js');

var github = require('./github')(config);

app.use(express["static"](__dirname + '/public'));

app.use(express.bodyParser());

app.use(function( req, res, next ) {
    function unauthorized() {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
      };

     var user = basicAuth(req);

     if( !user || !user.name || !user.pass )
        return unauthorized();

    if( user.pass != process.env['USER_' + user.name] )
        return unauthorized();

    return next();
});

app.get('/', function(req, res){
   res.sendfile(__dirname + '/public/index.html');
});


app.get('/overview', function(req, res){
   res.sendfile(__dirname + '/public/overview.html');
});


app.get('/issues.js', function(req, res) {
   res.set('Content-Type', 'application/javascript');
   github.fetchIssues(function(err, issues, status) {
      res.send("var issues = " + JSON.stringify(issues, null, 3) + ";\n" +
               "var status = " + JSON.stringify(status) + ";");
   });
});

app.get('/milestones.js', function(req, res) {
   res.set('Content-Type', 'application/javascript');
   github.fetchMilestones(function(err, milestones, status) {
      res.send("var milestones = " + JSON.stringify(milestones, null, 3) + ";\n" +
               "var status = " + JSON.stringify(status) + ";");
   });
});

app.get('/trigger_refresh', function(req, res) {
   res.set('Content-Type', 'plain/text');
   github.refresh(function() {
      res.send("");
   });
});


app.post('/update_ms_due_on', function(req, res) {

   github.update_ms_due_on(req.body.milestoneId, req.body.due_on, function () {
      res.send("");
   });

});


app.listen(config.port);
console.log('Listening on port '+config.port);
