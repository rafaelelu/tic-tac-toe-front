var express = require('express');
var app = express();
app.use(express.static(__dirname));
var server = require('http').createServer(app);

server.listen(process.env.PORT || 3000);
console.log('Server running...');