import dotenv from 'dotenv';
import http from 'http';
import {getGreetings, handleNotFound, getUsers, postUser, getUserById, updateUserById, removeUserById} from './handlers';

dotenv.config();
const PORT = process.env.PORT || 5050;

const server = http.createServer((req, res) => {
    const userId = req.url?.split('/')[3];
    if (req.method === 'GET' && req.url === '/') {
        return getGreetings(res);
    }
    if (req.method === 'GET') {
        if (userId) {
            return getUserById(userId, res);
        }
        if (req.url === '/api/users' || req.url === '/api/users/') {
            return getUsers(res);
        }
    }
    if (req.method === 'PUT') {
        if (userId) {
            return updateUserById(userId, req, res);
        }
    }
    if (req.method === 'DELETE') {
        if (userId) {
            return removeUserById(userId, res);
        }
    }
    if (req.method === 'POST' && (req.url === '/api/users' || req.url === '/api/users/')) {
        return postUser(req, res);
    }
    return handleNotFound(res);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
