import dotenv from 'dotenv';
import http from 'http';

dotenv.config();
const PORT = process.env.PORT || 5050;

const server = http.createServer((req, res) => {
    res.end('Hello from simple CRUD API');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
