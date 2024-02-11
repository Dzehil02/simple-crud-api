import http from 'http';
import {createPassword, users} from '../store/store';
import {User} from '../types/types';
import {isUser} from './validators';
import {validate as uuidValidate} from 'uuid';

export const getGreetings = (res: http.ServerResponse) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello from simple CRUD API');
};

export const handleNotFound = (res: http.ServerResponse) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found. Available endpoints are: /, /api/users, /api/users/:id');
};

export const getUsers = (res: http.ServerResponse) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users));
};

export const getUserById = (id: string, res: http.ServerResponse) => {
    try {
        if (!uuidValidate(id)) {
            res.setHeader('Content-Type', 'text/plain');
            throw Error();
        }
        const user = users.find((user) => user.id === id);

        if (!user) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`User with id ${id} not found`);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
        }
    } catch (error) {
        res.statusCode = 400;
        res.end('User ID is invalid (not uuid)');
    }
};

export const updateUserById = (id: string, req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
        if (!uuidValidate(id)) {
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 400;
            res.end('User ID is invalid (not uuid)');
            return;
        }

        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`User with id ${id} not found`);
        } else {
            res.setHeader('Content-Type', 'application/json');
            let userString: string = '';
            req.on('data', (data) => {
                userString += data;
            });
            req.on('end', () => {
                try {
                    const data: Partial<User> = JSON.parse(userString);
                    const updatedUser = {...users[userIndex], ...data};
                    users[userIndex] = updatedUser;

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(updatedUser));
                } catch (error) {
                    res.statusCode = 400;
                    res.end('Bad request');
                }
            });
        }
    } catch (error) {
        res.statusCode = 500;
        res.end('Internal Server Error');
    }
};

export const removeUserById = (id: string, res: http.ServerResponse) => {
    try {
        res.setHeader('Content-Type', 'text/plain');
        if (!uuidValidate(id)) {
            res.statusCode = 400;
            res.end('User ID is invalid (not uuid)');
            return;
        }

        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            res.statusCode = 404;
            res.end(`User with id ${id} not found`);
        } else {
            users.splice(userIndex, 1);
            res.statusCode = 204;
        }
    } catch (error) {
        res.statusCode = 500;
        res.end('Internal Server Error');
    }
};

export const postUser = (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.headers['content-type'] === 'application/json') {
        const pass = createPassword();
        let user: string = '';
        req.on('data', (data) => {
            user += data;
        });
        req.on('end', () => {
            try {
                const userObj: User = JSON.parse(user);
                const userObjWithId: User = {id: pass, ...userObj};

                if (!isUser(userObjWithId)) {
                    throw Error();
                }

                users.push(userObjWithId);
                res.statusCode = 201;
                res.end(user);
            } catch (error) {
                res.statusCode = 400;
                res.end('Bad request. Invalid data. User must have required fields: username, age, hobbies');
            }
        });
    } else {
        res.statusCode = 400;
        res.end('Bad request. Data must be in JSON format');
    }
};
