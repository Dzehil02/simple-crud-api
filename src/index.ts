import dotenv from 'dotenv';
import http from 'http';
import { getGreetings, handleNotFound, getUsers, postUser } from './handlers';

dotenv.config();
const PORT = process.env.PORT || 5050;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        return getGreetings(res);
    }
    if (req.method === 'GET' && req.url === '/api/users') {
        return getUsers(res);
    }
    if (req.method === 'POST' && req.url === '/api/users') {
        return postUser(req, res);
    }
    return handleNotFound(res);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
