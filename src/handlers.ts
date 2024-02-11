import http from 'http';
import {createPassword, users} from '../store/store';
import {User} from '../types/types';

export const getUsers = (res: http.ServerResponse) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users));
};

export const handleNotFound = (res: http.ServerResponse) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
};

export const getGreetings = (res: http.ServerResponse) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello from simple CRUD API');
};

function isUser(obj: any): obj is User {
    return (
        typeof obj.id === 'string' &&
        typeof obj.username === 'string' &&
        typeof obj.age === 'number' &&
        Array.isArray(obj.hobbies)
    );
}

function hasOnlyUserFields(obj: any): obj is User {
    return Object.keys(obj).every(key => ["username", "age", "hobbies", "id"].includes(key));
}

export const postUser = (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.setHeader('Content-Type', 'text/plain');
    if (req.headers['content-type'] === 'application/json') {
        const pass = createPassword();
        let user: string = '';
        req.on('data', (data) => {
            user += data;
        });
        req.on('end', () => {
            console.log(user);
            try {
                const userObj: User = JSON.parse(user);
                const userObjWithId: User = {id: pass, ...userObj};

                if (!isUser(userObjWithId) || !hasOnlyUserFields(userObjWithId)) {
                    throw Error('Bad request. Invalid data');
                } 

                users.push(userObjWithId);
                res.statusCode = 201;
                res.end(user);
            } catch (error) {
                res.statusCode = 400;
                res.end('Bad request. Invalid data');
            }
        });
    } else {
        res.statusCode = 400;
        res.end('Bad request. Data must be in JSON format');
    }
};
