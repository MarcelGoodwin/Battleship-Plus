http = require('http');
io = require('socket.io');

var firebase = require('firebase');
var firebaseConfig = {
    apiKey: "AIzaSyAu2GrYW0-sTZfeI_bsOTiyBF5sicnT6oQ",
    authDomain: "battleship-plus.firebaseapp.com",
    databaseURL: "https://battleship-plus.firebaseio.com",
    projectId: "battleship-plus",
    storageBucket: "battleship-plus.appspot.com",
    messagingSenderId: "24450549581"
};
firebase.initializeApp(config);


const port = 3000; 
const hostname = '127.0.0.1';

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
	console.log(`Server running on port at http://${hostname}:${port}/`);
});

