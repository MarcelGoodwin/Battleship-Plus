//dependencies
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

//initialize firebase
var firebase = require('firebase');
var firebaseConfig = {
    apiKey: "AIzaSyDsKkNBb4yRMq2uDpiysYHhR7Z8Iy38hHY",
    authDomain: "breakout-invasion.firebaseapp.com",
    databaseURL: "https://breakout-invasion.firebaseio.com",
    projectId: "breakout-invasion",
    storageBucket: "breakout-invasion.appspot.com",
    messagingSenderId: "213134177858"
};
firebase.initializeApp(firebaseConfig);

/*const db = firebase.firestore();
db.settings({timestampsInSnapshots: true});*/
/*const admin = require('firebase-admin');
var serviceAccount = require(__dirname + 'breakout-invasion-firebase-adminsdk-go6id-ab06bac286.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://breakout-invasion.firebaseio.com"
});

admin.initializeApp({
    credential
});*/

//console.log(firebase.app().name);

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

