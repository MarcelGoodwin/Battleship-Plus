
const http = require('http');

const port = process.env.PORT || 3000;
app.get('/', 

const server - http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content Type', 'text/plain');
	res.end('Hello World!\n');
});

