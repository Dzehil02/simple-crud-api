const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Hello from simple CRUD API');
});

server.listen(4000, () => {
    console.log('Server is running on port 4000');
});
