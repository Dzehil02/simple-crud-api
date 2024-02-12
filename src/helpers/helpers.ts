import http from 'http';
import {v1 as uuidv4} from 'uuid';
import {User, contentType} from '../types/types';

export const createPassword = () => uuidv4();

export const getUserId = (url: string) => {
    if (url.split('/').length <= 4) {
        return url.split('/')[3];
    }
};
export function isUser(obj: any): obj is User {
    return (
        typeof obj.id === 'string' &&
        typeof obj.username === 'string' &&
        typeof obj.age === 'number' &&
        Array.isArray(obj.hobbies)
    );
}

export const setResonse = (
    res: http.ServerResponse,
    status: number,
    contentType: contentType,
    message?: string | object
) => {
    res.statusCode = status;
    res.setHeader('Content-Type', contentType);
    if (message) {
        res.end(typeof message === 'string' ? message : JSON.stringify(message));
    } else {
        res.end();
    }
};
