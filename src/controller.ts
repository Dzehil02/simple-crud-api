import http from 'http';
import {
    getGreetings,
    handleNotFound,
    getUsers,
    postUser,
    getUserById,
    updateUserById,
    removeUserById,
} from './handlers';
import { getUserId } from './helpers';

export const controller = (req: http.IncomingMessage, res: http.ServerResponse) => {
    let userId;
    if (req.url) {
        userId = getUserId(req.url);
    }
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
    if (req.method === 'PUT' && userId) {
            return updateUserById(userId, req, res);
    }
    if (req.method === 'DELETE' && userId) {
            return removeUserById(userId, res);
    }
    if (req.method === 'POST' && (req.url === '/api/users' || req.url === '/api/users/')) {
        return postUser(req, res);
    }
    return handleNotFound(res);
}