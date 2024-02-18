import http from 'http';
import {users} from '../store/store';
import {User} from '../types/types';
import {createPassword, isUser, setResonse} from '../helpers/helpers';
import {validate as uuidValidate} from 'uuid';

export const getGreetings = (res: http.ServerResponse) => {
    setResonse(res, 200, 'text/plain', 'Hello from simple CRUD API');
};

export const handleNotFound = (res: http.ServerResponse) => {
    setResonse(res, 404, 'text/plain', 'Not found. Available endpoints are: /, /api/users, /api/users/:id');
};

export const getUsers = (res: http.ServerResponse) => {
    setResonse(res, 200, 'application/json', users);
};

export const getUserById = (id: string, res: http.ServerResponse) => {
    try {
        if (!uuidValidate(id)) {
            throw Error();
        }

        const user = users.find((user) => user.id === id);

        if (!user) {
            setResonse(res, 404, 'text/plain', `User with id ${id} not found`);
        } else {
            setResonse(res, 200, 'application/json', user);
        }
    } catch (error) {
        setResonse(res, 400, 'text/plain', 'User ID is invalid (not uuid)');
    }
};

export const updateUserById = (id: string, req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
        if (!uuidValidate(id)) {
            setResonse(res, 400, 'text/plain', 'User ID is invalid (not uuid)');
            return;
        }

        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            setResonse(res, 404, 'text/plain', `User with id ${id} not found`);
        } else {
            let userString: string = '';
            req.on('data', (data) => {
                userString += data;
            });
            req.on('end', () => {
                try {
                    const data: Partial<User> = JSON.parse(userString);
                    const updatedUser = {...users[userIndex], ...data};
                    users[userIndex] = updatedUser;
                    setResonse(res, 200, 'application/json', updatedUser);
                } catch (error) {
                    setResonse(res, 400, 'text/plain', 'Invalid request body');
                }
            });
        }
    } catch (error) {
        setResonse(res, 500, 'text/plain', 'Internal Server Error');
    }
};

export const removeUserById = (id: string, res: http.ServerResponse) => {
    try {
        res.setHeader('Content-Type', 'text/plain');
        if (!uuidValidate(id)) {
            setResonse(res, 400, 'text/plain', 'User ID is invalid (not uuid)');
            return;
        }

        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            setResonse(res, 404, 'text/plain', `User with id ${id} not found`);
        } else {
            users.splice(userIndex, 1);
            setResonse(res, 204, 'text/plain', `User with id ${id} deleted`);
        }
    } catch (error) {
        setResonse(res, 500, 'text/plain', 'Internal Server Error');
    }
};

export const postUser = (req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
        if (req.headers['content-type'] !== 'application/json') {
            setResonse(res, 400, 'text/plain', 'Bad request. Content-Type must be application/json');
            return;
        }
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
                    setResonse(
                        res,
                        400,
                        'text/plain',
                        'Bad request. Invalid data. User must have required fields: username, age, hobbies'
                    );
                    return;
                }

                users.push(userObjWithId);
                setResonse(res, 201, 'application/json', userObjWithId);
            } catch (error) {
                setResonse(res, 500, 'application/json', {
                    message: 'Oopps Internal Server Error',
                });
            }
        });
    } catch (error) {
        setResonse(res, 500, 'text/plain', 'Internal Server Error');
    }
};