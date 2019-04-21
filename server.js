//dependencies
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var waitroom = ('./waitroom.js');

//initialize firebase
var firebase = require('firebase');
var firebaseConfig = {
    apiKey: "AIzaSyAu2GrYW0-sTZfeI_bsOTiyBF5sicnT6oQ",
    authDomain: "battleship-plus.firebaseapp.com",
    databaseURL: "https://battleship-plus.firebaseio.com",
    projectId: "battleship-plus",
    storageBucket: "battleship-plus.appspot.com",
    messagingSenderId: "24450549581"
};
firebase.initializeApp(firebaseConfig);

console.log(firebase.app().name);

//runs on port 3000
var port = 3000;

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){
    //res.send('<h1>Hello World!</h1>');
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log(`user connected`);
    socket.on('disconnect', function(){
        console.log(`user disconnected`);
    });
});

server.listen(port, function(){
    console.log(`server running on port ${port}`);
});

